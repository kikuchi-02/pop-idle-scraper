import { Injectable } from '@angular/core';
import { ContentChange, Range, SelectionChange } from 'ngx-quill';
import Quill, { DeltaOperation, DeltaStatic } from 'quill';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { auditTime, first, map, mergeMap } from 'rxjs/operators';
import { TokenizeService } from 'src/app/services/tokenizer.service';
import { Message } from 'src/app/typing';
import { v4 as uuidv4 } from 'uuid';
import { QuillBinding } from 'y-quill';
import { Text, UndoManager } from 'yjs';
import { AppService } from '../../../services/app.service';
import { ScriptService } from '../script.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Delta = Quill.import('delta');

export interface TextLintMessageWithUuid {
  type: string;
  ruleId: string;
  message: string;
  data?: any;
  // fix?: TextlintMessageFixCommand;
  fix?: any;
  line: number;
  column: number;
  index: number;
  severity: number;

  uuid?: string;
  target?: string;
}

export interface TextlintResultWithUUid {
  filePath: string;
  messages: TextLintMessageWithUuid[];
}

@Injectable()
export class EditorService {
  private ytext: Text;
  private undoManager: UndoManager;
  private binding: QuillBinding;

  private editor: Quill;
  private selectionRange: Range;

  private textColor: string;
  private backgroundColor: string;

  public commentSubject$ = new Subject<string>();
  public focusChatMessage$ = new Subject<string>();

  public editorFocus$ = new Subject<{
    uuid: string;
    type: 'textlint' | 'comment';
  }>();

  public initialized$ = new ReplaySubject<void>(1);

  private textChanged$ = new Subject<string>();
  public wordCounter$ = this.initialized$.pipe(
    first(),
    mergeMap(() => this.textChanged$),
    auditTime(300),
    map(() => this.editor.getText().trim().length)
  );

  constructor(
    private appService: AppService,
    private scriptService: ScriptService,
    private tokenizeService: TokenizeService
  ) {}

  initialize(
    scriptId: number,
    editor: Quill,
    initialContent: DeltaStatic
  ): void {
    const uuid = this.appService.setLoading();

    this.editor = editor;

    const label = `script-${scriptId}`;

    this.ytext = this.appService.ydoc.getText(label);
    this.undoManager = new UndoManager(this.ytext);

    if (this.appService.useWs) {
      this.binding = new QuillBinding(
        this.ytext,
        editor,
        this.appService.wsProvider.awareness
      );
      this.appService.wsSynced().subscribe(() => {
        // default
        if (this.editor.getText() === '\n' || scriptId === undefined) {
          this.editor.setContents(initialContent);
        }
        this.initialized$.next();
        this.appService.resolveLoading(uuid);
      });
    } else {
      this.editor.setContents(initialContent);
      this.initialized$.next();
      this.appService.resolveLoading(uuid);
    }
  }

  onContentChanged(event: ContentChange): void {
    this.textChanged$.next();
  }

  getText(): string {
    return this.editor.getText();
  }

  getDelta(): DeltaOperation[] {
    return this.editor.getContents().ops;
  }

  setDelta(deltaOps: DeltaOperation[]): void {
    const content = this.editor.getContents();
    content.ops = deltaOps;
    this.editor.setContents(content);
  }

  undo(): void {
    this.checkInitialized();
    this.undoManager.undo();
  }
  redo(): void {
    this.checkInitialized();
    this.undoManager.redo();
  }

  reformat(): void {
    const txt = this.editor.getText();

    let insertCounter = 0;
    let targetIndex = txt.indexOf('。');
    while (targetIndex > -1) {
      if (txt.charAt(targetIndex + 1) !== '\n') {
        this.editor.insertText(targetIndex + insertCounter + 1, '\n');
        insertCounter += 1;
      }

      targetIndex = txt.indexOf('。', targetIndex + 1);
    }
  }

  selectionReformat(): void {
    const txt = this.editor.getText();
    const selection = this.editor.getSelection();

    let insertCounter = 0;
    let targetIndex = txt.indexOf('。', selection.index);
    while (
      targetIndex > -1 &&
      targetIndex < selection.index + selection.length
    ) {
      if (txt.charAt(targetIndex + 1) !== '\n') {
        this.editor.insertText(targetIndex + insertCounter + 1, '\n');
        insertCounter += 1;
      }

      targetIndex = txt.indexOf('。', targetIndex + 1);
    }
  }

  highlight(words: string[], color = '#FFAF7A'): void {
    words.forEach((word) => {
      const length = word.length;
      let targetIndex = this.editor.getText().indexOf(word);
      while (targetIndex > -1) {
        this.editor.formatText(targetIndex, length, 'background-color', color);
        targetIndex = this.editor.getText().indexOf(word, targetIndex + 1);
      }
    });
  }

  highlightByBaseForm(
    baseForms: string[],
    color = '#FFAF7A'
  ): Observable<void> {
    const text = this.editor.getText();
    return this.tokenizeService.tokenize(text).pipe(
      map((tokens) => {
        const delta = new Delta();
        tokens.forEach((token) => {
          if (baseForms.includes(token.base_form)) {
            delta.retain(token.surface.length, { 'background-color': color });
          } else {
            delta.retain(token.surface.length);
          }
        });
        this.editor.updateContents(delta);
      })
    );
  }

  removeHighlight(): void {
    const contents = this.editor.getContents();
    contents.ops = contents.ops.map((op) => {
      if (op.attributes?.background) {
        delete op.attributes.background;
      }
      return op;
    });
    this.editor.setContents(contents);
  }

  underline(words: string[]): void {
    words.forEach((word) => {
      const length = word.length;
      let targetIndex = this.editor.getText().indexOf(word);
      while (targetIndex > -1) {
        this.editor.formatText(targetIndex, length, 'underline', true);
        targetIndex = this.editor.getText().indexOf(word, targetIndex + 1);
      }
    });
  }

  removeUnderline(): void {
    const contents = this.editor.getContents();
    contents.ops = contents.ops.map((op) => {
      if (op.attributes?.underline) {
        delete op.attributes.underline;
      }
      return op;
    });
    this.editor.setContents(contents);
  }

  removeStrikes(): void {
    const contents = this.editor.getContents();
    contents.ops = contents.ops.filter((op) => !op.attributes?.strike);
    this.editor.setContents(contents);
  }

  onChangeTextColor(color: string): void {
    this.textColor = color;
  }
  onChangeBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }
  onSelectionChange(selectionChange: SelectionChange): void {
    if (selectionChange.range) {
      this.selectionRange = selectionChange.range;
    }
  }

  selectionBold(): void {
    const selection = this.selectionRange;
    this.editor.formatText(selection.index, selection.length, 'bold', true);
  }

  selectionColorUp(): void {
    const selection = this.selectionRange;
    const color = ['#000000', '#ffffff'].includes(this.textColor)
      ? false
      : this.textColor;
    this.editor.formatText(selection.index, selection.length, 'color', color);
  }

  selectionBackgroundColorUp(): void {
    const selection = this.selectionRange;
    this.editor.formatText(
      selection.index,
      selection.length,
      'background',
      this.backgroundColor
    );
  }

  selectionStrike(): void {
    const selection = this.selectionRange;
    this.editor.formatText(selection.index, selection.length, 'strike', true);
  }

  selectionComment(): void {
    const uuid = uuidv4();
    const selection = this.selectionRange;
    this.editor.formatText(selection.index, selection.length, 'comment', {
      uuid,
    });

    this.commentSubject$.next(uuid);
  }

  unselectComment(uuid: string): void {
    const contents = this.editor.getContents();
    contents.ops = contents.ops.map((op) => {
      if (op.attributes?.comment?.uuid === uuid) {
        delete op.attributes.comment;
      }
      return op;
    });
    this.editor.setContents(contents);
  }

  focusChatMessage(uuid: string): void {
    this.focusChatMessage$.next(uuid);
  }

  initialComments(messages: Message[]): Message[] {
    const messageUuids = new Map<string, Message>();
    messages.forEach((message) => {
      messageUuids.set(message.uuid, message);
    });

    const delta = new Delta();
    const contents = this.editor.getContents();
    const text = this.editor.getText();
    let index = 0;
    contents.ops.forEach((op) => {
      const uuid = op.attributes?.comment?.uuid;
      const length = op.insert.length;

      if (!uuid) {
        delta.retain(length);
        index += length;
        return;
      }

      if (messageUuids.has(uuid)) {
        const message = messageUuids.get(uuid);
        message.selectedText = message.selectedText || op.insert;
        delta.retain(length, { comment: { uuid, message: message.body } });
      } else {
        const attrs = op.attributes;
        delete attrs.comment;
        delta.delete(length);
        const sub = text.slice(index, index + length);
        delta.insert(sub, attrs);
      }
      index += length;
    });
    this.editor.updateContents(delta);
    return messages;
  }

  selectionCommentFocused(uuid: string): void {
    this.editorFocus$.next({ uuid, type: 'comment' });
  }

  selectionCommentText(uuid: string): string {
    return this.editor
      .getContents()
      .ops.filter((delta) => delta.attributes?.comment?.uuid === uuid)
      .map((delta) => delta.insert)
      .join();
  }

  applySelectionCommentMessage(uuid: string, message: string): void {
    const contents = this.editor.getContents();
    const delta = new Delta();
    contents.ops.forEach((op) => {
      const length = op.insert.length;
      if (op.attributes?.comment?.uuid === uuid) {
        delta.retain(length, { comment: { uuid, message } });
      } else {
        delta.retain(length);
      }
    });

    this.editor.updateContents(delta);
  }

  applyTextLintResult(result: TextlintResultWithUUid): TextlintResultWithUUid {
    const text = this.editor.getText();
    const lines = text.split('\n');

    const delta = new Delta();

    let lineCounter = 0;
    let messageCounter = 0;
    let characterIndex = 0;

    while (
      lineCounter < lines.length &&
      messageCounter < result.messages.length
    ) {
      const msg = result.messages[messageCounter];
      const line = lines[lineCounter];
      // length with new line character length
      const lineEndIndex = characterIndex + line.length + 1;

      // msg指している内容が、前のlineの時はmessageのtargetだけ入力して進める。
      if (msg.index < characterIndex) {
        msg.target = lines[lineCounter - 1].slice(0, 10) + '..';
        messageCounter++;
        continue;
      }

      // msgがlineの中にあれば、errorsの中に入れる。
      if (characterIndex <= msg.index && msg.index < lineEndIndex) {
        msg.uuid = uuidv4();
        msg.target = line.slice(0, 10) + '..';
        delta.retain(line.length + 1, {
          lint: {
            uuid: msg.uuid,
            message: msg.message,
          },
        });
        messageCounter++;

        lineCounter++;
        characterIndex += line.length + 1;
        continue;
      }

      // msgが先のlineの内容を指している時は、lineCounterのみ進める。
      if (lineEndIndex <= msg.index) {
        lineCounter++;
        delta.retain(line.length + 1);
        // length with new line character length
        characterIndex += line.length + 1;
      }
    }

    this.editor.updateContents(delta);

    return result;
  }

  removeTextLintResult(): void {
    const contents = this.editor.getContents();
    const text = this.editor.getText();
    const delta = new Delta();

    let index = 0;
    contents.ops.forEach((op) => {
      const length = op.insert.length;
      if (op.attributes?.lint) {
        const attrs = op.attributes;
        delete attrs.lint;
        delta.delete(length);
        const sub = text.slice(index, index + length);
        delta.insert(sub, attrs);
      } else {
        delta.retain(length);
      }
      index += length;
    });
    this.editor.updateContents(delta);
  }

  focusTextLintMessage(message: TextLintMessageWithUuid): void {
    this.editorFocus$.next({ uuid: message.uuid, type: 'textlint' });
  }

  private checkInitialized(): void {
    if (!this.editor) {
      throw new Error('ytext is not initialized');
    }
  }
}
