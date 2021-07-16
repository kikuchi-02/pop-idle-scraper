import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  constructor() {}

  register(val: T) {
    this.undoStack.push(val);
  }

  undo(): T {
    const undoLength = this.undoStack.length;
    if (undoLength < 2) {
      return undefined;
    }
    const stack = this.undoStack.pop();
    this.redoStack.push(stack);
    return this.undoStack[undoLength - 1 - 1];
  }
  redo(): T {
    if (this.redoStack.length < 1) {
      return undefined;
    }
    const stack = this.redoStack.pop();
    this.undoStack.push(stack);
    return stack;
  }
}
