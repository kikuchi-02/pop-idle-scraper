import { Injectable } from '@angular/core';
import { diffChars } from 'diff';
import { Text, UndoManager, YEvent } from 'yjs';
import { AppService } from '../services/app.service';

// should be used as instance

@Injectable()
export class CrdtTextService {
  private ytext: Text;
  private undoManager: UndoManager;
  private previousState: string;

  private get initialized(): boolean {
    return this.ytext !== undefined;
  }

  constructor(private appService: AppService) {}

  createText(label: string, currentState: string): string {
    this.previousState = currentState;
    this.ytext = this.appService.ydoc.getText(label);
    this.undoManager = new UndoManager(this.ytext);
    const txt = this.ytext.toString();
    this.previousState = txt;
    return txt;
  }

  registerObserver(
    observer: (txt: string, delta: YEvent['delta']) => void
  ): void {
    this.ytext.observe((event, transaction) => {
      const txt = this.ytext.toString();
      observer(txt, event.delta);
    });
  }

  applyDeltaToCurrent(
    delta: YEvent['delta'],
    current: { txt: string; selectionStart?: number; selectionEnd?: number }
  ): { txt: string; selectionStart?: number; selectionEnd?: number } {
    this.checkInitialized();

    let index = 0;
    let txt = current.txt;

    let start = current.selectionStart;
    let end = current.selectionEnd;
    const selectionChange = start !== undefined && end !== undefined;

    for (const diff of delta) {
      if (diff.retain) {
        index += diff.retain;
      } else if (diff.insert) {
        txt = txt.slice(0, index) + diff.insert + txt.slice(index);
        index += diff.insert.length;
        if (selectionChange) {
          if (index < start) {
            start += diff.insert.length;
          }
          if (index < end) {
            end += diff.insert.length;
          }
        }
      } else if (diff.delete) {
        txt = txt.slice(0, index) + txt.slice(index + diff.delete);
        if (selectionChange) {
          if (index < start) {
            start -= diff.delete;
          }
          if (index < end) {
            end -= diff.delete;
          }
        }
      }
    }

    this.previousState = txt;

    return { txt, selectionStart: start, selectionEnd: end };
  }

  /**
   * should be called in ngDoCheck
   * @param current
   */
  onTextChange(current: string): void {
    try {
      this.checkInitialized();
    } catch (e) {
      return;
    }
    if (this.previousState === undefined || this.previousState !== current) {
      const diffs = diffChars(this.previousState || '', current);
      let index = 0;
      for (const diff of diffs) {
        if (diff.added) {
          this.ytext.insert(index, diff.value);
        } else if (diff.removed) {
          this.ytext.delete(index, diff.value.length);
        }
        index += diff.count;
      }
      this.previousState = current;
    }
  }

  undo(): void {
    this.checkInitialized();
    this.undoManager.undo();
  }
  redo(): void {
    this.checkInitialized();
    this.undoManager.redo();
  }

  private checkInitialized(): void {
    if (!this.initialized) {
      throw new Error('ytext is not initialized');
    }
  }
}
