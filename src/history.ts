export class History<T> {
  private _past: T[] = [];
  private _present: T;
  private _future: T[] = [];
  private _initialState: T;

  constructor(initialState: T) {
    this._present = initialState;
    this._initialState = initialState;
  }

  get present(): T {
    return this._present;
  }

  get past(): T[] {
    return this._past;
  }

  get future(): T[] {
    return this._future;
  }

  set present(state: T) {
    if (this._present === state) {
      return;
    }
    if (this._present !== null) {
      this._past.push(this._present);
    }
    this._present = state;
    this._future = [];
  }

  undo() {
    if (this._past.length === 0) {
      return;
    }
    const previous = this._past.pop();
    if (previous !== undefined) {
      if (this._present !== null) {
        this._future.unshift(this._present);
      }
      this._present = previous;
    }
  }

  redo() {
    if (this._future.length === 0) {
      return;
    }
    const next = this._future.shift();
    if (next !== undefined) {
      if (this._present !== null) {
        this._past.push(this._present);
      }
      this._present = next;
    }
  }

  clear() {
    this._past = [];
    this._present = this._initialState;
    this._future = [];
  }
}