import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  // same sa current state
  private undoPool: T;
  private redoPool: T;

  get ableToUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get ableToRedo(): boolean {
    return this.redoStack.length > 0;
  }

  constructor() {}

  register(val: T) {
    this.pushUndo(val);
  }

  undo(): T {
    const stack = this.undoStack.pop();
    this.pushRedo(stack);
    this.undoPool = stack;
    return stack;
  }
  redo(): T {
    const stack = this.redoStack.pop();
    this.redoPool = stack;
    this.pushUndo(stack);
    return stack;
  }

  private pushUndo(val: T): void {
    if (this.undoPool) {
      if (this.undoPool === val) {
        return;
      }
      this.undoStack.push(this.undoPool);
    }
    this.undoPool = val;
  }

  private pushRedo(val: T): void {
    if (this.redoPool) {
      if (this.redoPool === val) {
        return;
      }
      this.redoStack.push(this.redoPool);
    }
    this.redoPool = val;
  }
}
