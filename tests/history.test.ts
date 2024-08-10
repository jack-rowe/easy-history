import { History, HistorySnapshot } from '../src/history';

describe('History Class', () => {
  describe('with primitive types', () => {
    let history: History<number>;

    beforeEach(() => {
      history = new History<number>(0);
    });

    test('initial state', () => {
      expect(history.present).toBe(0);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    test('setting present', () => {
      history.present = 1;
      expect(history.present).toBe(1); 
      expect(history.past).toEqual([0]);
      expect(history.future).toEqual([]);
    });

    test('undo', () => {
      history.present = 1;
      history.present = 2;
      history.undo();
      expect(history.present).toBe(1);
      expect(history.past).toEqual([0]);
      expect(history.future).toEqual([2]);
    });

    test('redo', () => {
      history.present = 1;
      history.present = 2;
      history.undo();
      history.redo();
      expect(history.present).toBe(2);
      expect(history.past).toEqual([0, 1]);
      expect(history.future).toEqual([]);
    });

    test('clear', () => {
      history.present = 1;
      history.present = 2;
      history.clear();
      expect(history.present).toBe(0);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    test('undo on empty past', () => {
      history.undo();
      expect(history.present).toBe(0);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    test('redo on empty future', () => {
      history.redo();
      expect(history.present).toBe(0);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    test('setting same present value', () => {
      history.present = 0;
      expect(history.present).toBe(0);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });
  });

  describe('with objects', () => {
    interface TestObject {
      value: number;
      text: string;
    }

    let history: History<TestObject>;

    beforeEach(() => {
      history = new History<TestObject>({ value: 0, text: 'initial' });
    });

    test('initial state', () => {
      expect(history.present).toEqual({ value: 0, text: 'initial' });
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    test('setting present', () => {
      history.present = { value: 1, text: 'first' };
      expect(history.present).toEqual({ value: 1, text: 'first' });
      expect(history.past).toEqual([{ value: 0, text: 'initial' }]);
      expect(history.future).toEqual([]);
    });

    test('undo and redo', () => {
      history.present = { value: 1, text: 'first' };
      history.present = { value: 2, text: 'second' };
      history.undo();
      expect(history.present).toEqual({ value: 1, text: 'first' });
      history.redo();
      expect(history.present).toEqual({ value: 2, text: 'second' });
    });
  });

  describe('with arrays', () => {
    let history: History<number[]>;

    beforeEach(() => {
      history = new History<number[]>([]);
    });

    test('initial state', () => {
      expect(history.present).toEqual([]);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });

    test('setting present', () => {
      history.present = [1, 2, 3];
      expect(history.present).toEqual([1, 2, 3]);
      expect(history.past).toEqual([[]]);
      expect(history.future).toEqual([]);
    });

    test('undo and redo', () => {
      history.present = [1, 2, 3];
      history.present = [1, 2, 3, 4];
      history.undo();
      expect(history.present).toEqual([1, 2, 3]);
      history.redo();
      expect(history.present).toEqual([1, 2, 3, 4]);
    });
  });

  describe('edge cases', () => {
    test('initial null state', () => {
      const history = new History<number | null>(null);
      expect(history.present).toBeNull();
      history.present = 1;
      expect(history.present).toBe(1);
      expect(history.past).toEqual([]);
    });

    test('multiple undos and redos', () => {
      const history = new History<number>(0);
      history.present = 1;
      history.present = 2;
      history.present = 3;
      history.undo();
      history.undo();
      expect(history.present).toBe(1);
      history.redo();
      expect(history.present).toBe(2);
      history.present = 4;
      expect(history.future).toEqual([]);
    });

    test('clear after operations', () => {
      const history = new History<string>('initial');
      history.present = 'first';
      history.present = 'second';
      history.undo();
      history.clear();
      expect(history.present).toBe('initial');
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);
    });
  });
});

describe('History Class Extended Tests', () => {
  describe('Complex scenarios', () => {
    let history: History<number>;

    beforeEach(() => {
      history = new History<number>(0);
    });

    test('multiple undos followed by multiple redos', () => {
      history.present = 1;
      history.present = 2;
      history.present = 3;
      history.present = 4;
      history.present = 5;

      history.undo();
      history.undo();
      history.undo();
      expect(history.present).toBe(2);
      expect(history.past).toEqual([0, 1]);
      expect(history.future).toEqual([3, 4, 5]);

      history.redo();
      history.redo();
      expect(history.present).toBe(4);
      expect(history.past).toEqual([0, 1, 2, 3]);
      expect(history.future).toEqual([5]);
    });

    test('undo all the way back to initial state', () => {
      history.present = 1;
      history.present = 2;
      history.present = 3;

      history.undo();
      history.undo();
      history.undo();
      expect(history.present).toBe(0);
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([1, 2, 3]);
    });

    test('redo all the way forward after undoing everything', () => {
      history.present = 1;
      history.present = 2;
      history.present = 3;

      history.undo();
      history.undo();
      history.undo();
      history.redo();
      history.redo();
      history.redo();
      expect(history.present).toBe(3);
      expect(history.past).toEqual([0, 1, 2]);
      expect(history.future).toEqual([]);
    });

    test('setting new present after undoing clears future', () => {
      history.present = 1;
      history.present = 2;
      history.present = 3;
      history.undo();
      history.undo();
      history.present = 4;
      expect(history.present).toBe(4);
      expect(history.past).toEqual([0, 1]);
      expect(history.future).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    test('undo and redo with undefined values', () => {
      const history = new History<number | undefined>(undefined);
      history.present = 1;
      history.present = undefined;
      history.present = 2;

      history.undo();
      expect(history.present).toBeUndefined();
      history.undo();
      expect(history.present).toBe(1);
      history.redo();
      expect(history.present).toBeUndefined();
    });

    test('rapid alternating undo and redo', () => {
      const history = new History<number>(0);
      history.present = 1;
      history.present = 2;

      for (let i = 0; i < 100; i++) {
        history.undo();
        history.redo();
      }

      expect(history.present).toBe(2);
      expect(history.past).toEqual([0, 1]);
      expect(history.future).toEqual([]);
    });

    test('clear after complex operations', () => {
      const history = new History<string>('initial');
      history.present = 'first';
      history.present = 'second';
      history.undo();
      history.present = 'third';
      history.undo();
      history.clear();

      expect(history.present).toBe('initial');
      expect(history.past).toEqual([]);
      expect(history.future).toEqual([]);

      history.present = 'new';
      expect(history.past).toEqual(['initial']);
    });
  });

  describe('With complex objects', () => {
    interface ComplexObject {
      id: number;
      name: string;
      nested: {
        value: number;
        array: string[];
      };
    }

    let history: History<ComplexObject>;

    beforeEach(() => {
      history = new History<ComplexObject>({
        id: 0,
        name: 'initial',
        nested: {
          value: 0,
          array: []
        }
      });
    });

    test('handling complex object mutations', () => {
      history.present = {
        ...history.present,
        name: 'updated',
        nested: {
          ...history.present.nested,
          value: 1
        }
      };

      history.present = {
        ...history.present,
        nested: {
          ...history.present.nested,
          array: ['item1']
        }
      };

      expect(history.present).toEqual({
        id: 0,
        name: 'updated',
        nested: {
          value: 1,
          array: ['item1']
        }
      });

      history.undo();
      expect(history.present).toEqual({
        id: 0,
        name: 'updated',
        nested: {
          value: 1,
          array: []
        }
      });
    });
  });

  describe('Performance considerations', () => {
    test('handling large number of operations', () => {
      const history = new History<number>(0);
      const operationCount = 10000;

      for (let i = 1; i <= operationCount; i++) {
        history.present = i;
      }

      expect(history.present).toBe(operationCount);
      expect(history.past.length).toBe(operationCount);

      for (let i = 0; i < operationCount; i++) {
        history.undo();
      }

      expect(history.present).toBe(0);
      expect(history.future.length).toBe(operationCount);
    });
  });

  describe('Behavior with different types', () => {
    test('with boolean type', () => {
      const history = new History<boolean>(false);
      history.present = true;
      history.present = false;
      history.undo();
      expect(history.present).toBe(true);
    });

    test('with Date objects', () => {
      const initialDate = new Date('2023-01-01');
      const history = new History<Date>(initialDate);
      const secondDate = new Date('2023-02-01');
      history.present = secondDate;
      expect(history.present).toEqual(secondDate);
      history.undo();
      expect(history.present).toEqual(initialDate);
    });

    test('with functions', () => {
      const initialFn = () => 'initial';
      const history = new History<() => string>(initialFn);
      const newFn = () => 'new';
      history.present = newFn;
      expect(history.present()).toBe('new');
      history.undo();
      expect(history.present()).toBe('initial');
    });
  });
});

describe('Batch', () => {
  let history: History<{ count: number; name: string }>;

  beforeEach(() => {
    history = new History({ count: 0, name: '' });
  });

  test('batch updates', () => {
    history.batch((state) => ({ ...state, count: state.count + 1, name: 'Test' }));
    expect(history.present).toEqual({ count: 1, name: 'Test' });
    expect(history.past).toHaveLength(1);
    expect(history.future).toHaveLength(0);
  });
});


describe('Snapshot', () => {
  let history: History<{ count: number; name: string }>;

  beforeEach(() => {
    history = new History({ count: 0, name: '' });
  });

  test('take and restore snapshot', () => {
    history.present = { count: 1, name: 'First' };
    history.present = { count: 2, name: 'Second' };
    
    const snapshot: HistorySnapshot<{ count: number; name: string }> = history.takeSnapshot();
    expect(snapshot.present).toEqual({ count: 2, name: 'Second' });
    expect(snapshot.past).toHaveLength(2);
    
    history.present = { count: 3, name: 'Third' };
    history.restoreSnapshot(snapshot);
    
    expect(history.present).toEqual({ count: 2, name: 'Second' });
    expect(history.past).toHaveLength(2);
    expect(history.future).toHaveLength(0);
  });
});
