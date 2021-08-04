import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Text, UndoManager } from 'yjs';
import { AppService } from '../services/app.service';

@Injectable()
export class CrdtTextService {
  private ytext: Text;
  private undoManager: UndoManager;

  private get initialized(): boolean {
    return this.ytext !== undefined;
  }

  constructor(private appService: AppService) {}

  createText(label: string, currentState: string): Observable<string> {
    this.ytext = this.appService.ydoc.getText(label);
    this.undoManager = new UndoManager(this.ytext);
    const subject = new ReplaySubject<string>(1);
    this.ytext.observe((event, transaction) => {
      const text = this.ytext.toString();
      subject.next(text);
    });
    const txt = this.ytext.toString();
    if (txt) {
      subject.next(txt);
    } else {
      this.ytext.insert(0, currentState);
    }
    return subject.asObservable();
  }

  setText(text: string): void {
    this.ytext.delete(0, this.ytext.length);
    this.ytext.insert(0, text);
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
