import { Injectable } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { DeltaOperation, Quill } from 'quill';
import { QuillBinding } from 'y-quill';
import { Text, UndoManager } from 'yjs';
import { AppService } from '../../../services/app.service';

@Injectable()
export class EditorService {
  private ytext: Text;
  private undoManager: UndoManager;
  private binding: QuillBinding;

  private editor: Quill;

  private color: string;

  public get wsConnected(): boolean {
    return this.appService.wsProvider.wsconnected;
  }

  constructor(private appService: AppService) {}

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
  }

  onContentChanged(event: ContentChange): void {
    console.log('changed', event.content);
  }

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

  highlight(word: string, color = 'yellow'): void {
    const length = word.length;
    let targetIndex = this.editor.getText().indexOf(word);
    while (targetIndex > -1) {
      this.editor.formatText(targetIndex, length, 'background-color', color);
      targetIndex = this.editor.getText().indexOf(word, targetIndex + 1);
    }
  }

  removeHighlight(): void {
    const contents = this.editor.getContents();
    contents.ops = contents.ops.map((op) => {
      if (op.attributes?.background === 'yellow') {
        delete op.attributes.background;
      }
      return op;
    });
    this.editor.setContents(contents);
  }

  underline(words: string[]): void {
    const contents = this.editor.getContents();
    contents.ops = contents.ops.map((op) => {
      if (
        words.some(
          (word) => typeof op.insert === 'string' && op.insert.includes(word)
        )
      ) {
        if (!op.attributes) {
          op.attributes = {};
        }
        op.attributes.underline = true;
      }
      return op;
    });
    this.editor.setContents(contents);
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

  onChangeColor(color: string): void {
    console.log({ color });
    this.color = color;
  }

  selectionColorUp(): void {
    const selection = this.editor.getSelection();
    this.editor.formatText(
      selection.index,
      selection.length,
      'color',
      this.color
    );
  }

  selectionBackgroundColorUp(): void {
    const selection = this.editor.getSelection();
    this.editor.formatText(
      selection.index,
      selection.length,
      'background',
      this.color
    );
  }

  selectionStrike(): void {
    const selection = this.editor.getSelection();
    this.editor.formatText(selection.index, selection.length, 'strike', 'true');
  }

  private checkInitialized(): void {
    if (!this.editor) {
      throw new Error('ytext is not initialized');
    }
  }
}
