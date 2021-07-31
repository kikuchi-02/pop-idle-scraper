import { Injectable } from '@angular/core';
import { ContentChange, Range, SelectionChange } from 'ngx-quill';
import { DeltaOperation, Quill } from 'quill';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { QuillBinding } from 'y-quill';
import { Text, UndoManager } from 'yjs';
import { AppService } from '../../../services/app.service';
import { ScriptService } from '../script.service';

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

  public get wsConnected(): boolean {
    return this.appService.wsProvider.wsconnected;
  }

  public commentSubject$ = new Subject<string>();
  public commentFocused$ = new Subject<string>();
  public focusChatMessage$ = new Subject<string>();

  public textlintResultFocused$ = new Subject<TextLintMessageWithUuid>();

  public initialized$ = new ReplaySubject<void>(1);

  constructor(
    private appService: AppService,
    private scriptService: ScriptService
  ) {}

  initialize(scriptId: number, editor: Quill): void {
    this.editor = editor;
    const contents = this.editor.getContents();
    this.editor.getModule('text-marking');

    const label = `script-${scriptId}`;
    this.ytext = this.appService.ydoc.getText(label);
    this.undoManager = new UndoManager(this.ytext);

    if (this.wsConnected) {
      this.binding = new QuillBinding(
        this.ytext,
        editor,
        this.appService.wsProvider.awareness
      );
      // default
      if (this.editor.getText() === '\n') {
        this.editor.setContents(contents);
      } else if (scriptId === undefined) {
        this.editor.setContents(contents);
      }
    }
    this.initialized$.next();
  }

  onContentChanged(event: ContentChange): void {}

  getText(): string {
    return this.editor.getText();
  }

  getDelta(): DeltaOperation[] {
    return this.editor.getContents().ops;
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
    return this.scriptService.tokenize(text).pipe(
      map((tokens) => {
        tokens.forEach((token) => {
          if (baseForms.includes(token.basic_form)) {
            this.editor.formatText(
              token.word_position - 1,
              token.surface_form.length,
              'background-color',
              color
            );
          }
        });
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
    this.editor.formatText(
      selection.index,
      selection.length,
      'color',
      this.textColor
    );
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
      color: '#FCC933',
    });

    this.commentSubject$.next(uuid);
  }

  unselectComment(uuid: string): void {
    const contents = this.editor.getContents();
    let find = false;
    contents.ops = contents.ops.map((op) => {
      if (op.attributes?.comment?.uuid === uuid) {
        find = true;
        delete op.attributes.comment;
        // delete op.attributes.background;
      }
      return op;
    });
    this.editor.setContents(contents);
  }

  focusChatMessage(uuid: string): void {
    this.focusChatMessage$.next(uuid);
  }

  selectionCommentFocused(uuid: string): void {
    // const contents = this.editor.getContents();
    // contents.ops = contents.ops.map((op) => {
    //   if (op.attributes?.comment?.uuid === uuid) {
    //     op.attributes.comment.color = '#FCC933';
    //   }
    //   return op;
    // });
    // this.editor.setContents(contents);
    this.commentFocused$.next(uuid);
  }
  selectionCommentUnfocused(uuid: string): void {
    // const contents = this.editor.getContents();
    // contents.ops = contents.ops.map((op) => {
    //   if (op.attributes?.comment?.uuid === uuid) {
    //     op.attributes.comment.color = '#FEE9B2';
    //   }
    //   return op;
    // });
    // this.editor.setContents(contents);
  }
  selectionCommentText(uuid: string): string {
    return this.editor
      .getContents()
      .ops.filter((delta) => delta.attributes?.comment?.uuid === uuid)
      .map((delta) => delta.insert)
      .join();
  }

  applyTextLintResult(result: TextlintResultWithUUid): TextlintResultWithUUid {
    const text = this.editor.getText();
    const splitted = text.split('\n');

    const accumulated = splitted.reduce((previous, current, index) => {
      let start = 0;
      if (index > 0) {
        start += previous[index - 1].end + 1;
      }
      const end = start + current.length;
      previous.push({ start, end });
      return previous;
    }, []);

    result.messages = (result as TextlintResultWithUUid).messages.map((msg) => {
      msg.uuid = uuidv4();
      const targetIndexes = accumulated[msg.line - 1];
      this.editor.formatText(
        targetIndexes.start,
        targetIndexes.end - targetIndexes.start,
        'lint',
        { uuid: msg.uuid, message: msg.message }
      );

      const endIndex = Math.min(targetIndexes.end, targetIndexes.start + 10);
      msg.target = text.slice(targetIndexes.start, endIndex) + '..';

      return msg;
    });

    return result;
  }

  removeTextLintResult(): void {
    const contents = this.editor.getContents();
    let find = false;
    contents.ops = contents.ops.map((op) => {
      if (op.attributes?.lint) {
        find = true;
        delete op.attributes.lint;
      }
      return op;
    });
    if (find) {
      this.editor.setContents(contents);
    }
  }

  focusTextLintMessage(message: TextLintMessageWithUuid): void {
    this.textlintResultFocused$.next(message);
  }

  private checkInitialized(): void {
    if (!this.editor) {
      throw new Error('ytext is not initialized');
    }
  }
}
