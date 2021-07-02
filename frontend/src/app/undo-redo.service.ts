import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {
  undoStack: string[] = [];
  redoStack: string[] = [];

  get ableToUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get ableToRedo(): boolean {
    return this.redoStack.length > 0;
  }

  constructor() {}

  register(str: string) {
    this.undoStack.push(str);
  }

  undo(): string {
    if (this.undoStack.length === 0) {
      return undefined;
    }
    const stack = this.undoStack.pop();
    this.redoStack.push(JSON.parse(JSON.stringify(stack)));
    return stack;
  }
  redo(): string {
    if (this.redoStack.length === 0) {
      return undefined;
    }
    const stack = this.redoStack.pop();
    return stack;
  }
}
