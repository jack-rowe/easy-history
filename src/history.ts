export interface HistorySnapshot<T> {
  past: T[];
  present: T;
  future: T[];
}

export class History<T> {
  private _past: T[] = [];
  private _present: T;
  private _future: T[] = [];
  private _initialState: T;
  private _maxSize: number;
  private _isEqual: (a: T, b: T) => boolean;

  constructor(
    initialState: T,
    maxSize: number = Infinity,
    isEqual: (a: T, b: T) => boolean = (a, b) => a === b
  ) {
    this._present = initialState;
    this._initialState = initialState;
    this._maxSize = maxSize;
    this._isEqual = isEqual;
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
    if (this._isEqual(this._present, state)) {
      return;
    }
    if (this._present !== null) {
      this._past.push(this._present);
      if (this._past.length > this._maxSize) {
        this._past.shift();
      }
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

  batch(updateFn: (currentState: T) => T) {
    const newState = updateFn(this._present);
    if (!this._isEqual(this._present, newState)) {
      this.present = newState;
    }
  }

  takeSnapshot(): HistorySnapshot<T> {
    return {
      past: [...this._past],
      present: this._present,
      future: [...this._future]
    };
  }

  restoreSnapshot(snapshot: HistorySnapshot<T>) {
    this._past = [...snapshot.past];
    this._present = snapshot.present;
    this._future = [...snapshot.future];
  }
}
