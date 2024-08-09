import { History } from '../src/history';

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