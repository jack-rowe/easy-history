import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../src/useHistory';
import { HistorySnapshot } from '../src/history';

describe('useHistory', () => {
    it('should initialize with the given state', () => {
        const { result } = renderHook(() => useHistory(0));
        expect(result.current.state).toBe(0);
      });
    
      it('should update state when set is called', () => {
        const { result } = renderHook(() => useHistory(0));
        act(() => {
          result.current.set(5);
        });
        expect(result.current.state).toBe(5);
      });
    
      it('should undo state changes', () => {
        const { result } = renderHook(() => useHistory(0));
        act(() => {
          result.current.set(5);
          result.current.set(10);
        });
        act(() => {
          result.current.undo();
        });
        expect(result.current.state).toBe(5);
      });
    
      it('should redo undone state changes', () => {
        const { result } = renderHook(() => useHistory(0));
        act(() => {
          result.current.set(5);
          result.current.set(10);
          result.current.undo();
        });
        act(() => {
          result.current.redo();
        });
        expect(result.current.state).toBe(10);
      });
    
      it('should clear history', () => {
        const { result } = renderHook(() => useHistory(0));
        act(() => {
          result.current.set(5);
          result.current.set(10);
          result.current.clear();
        });
        expect(result.current.state).toBe(0);
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
      });
    
      it('should correctly update canUndo and canRedo', () => {
        const { result } = renderHook(() => useHistory(0));
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(false);
        act(() => {
          result.current.set(5);
        });
        expect(result.current.canUndo).toBe(true);
        expect(result.current.canRedo).toBe(false);
        act(() => {
          result.current.undo();
        });
        expect(result.current.canUndo).toBe(false);
        expect(result.current.canRedo).toBe(true);
      });
    
      it('should work with complex objects', () => {
        interface TestState {
          count: number;
          text: string;
        }
        const initialState: TestState = { count: 0, text: '' };
        const { result } = renderHook(() => useHistory<TestState>(initialState));
        act(() => {
          result.current.set({ count: 1, text: 'hello' });
        });
        expect(result.current.state).toEqual({ count: 1, text: 'hello' });
        act(() => {
          result.current.set({ count: 2, text: 'world' });
        });
        expect(result.current.state).toEqual({ count: 2, text: 'world' });
        act(() => {
          result.current.undo();
        });
        expect(result.current.state).toEqual({ count: 1, text: 'hello' });
      });

  it('should not undo when history is empty', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(0);
  });

  it('should not redo when future is empty', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(5);
      result.current.redo();
    });
    expect(result.current.state).toBe(5);
  });

  it('should clear future history when setting new state after undo', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(5);
      result.current.set(10);
      result.current.undo();
      result.current.set(7);
    });
    expect(result.current.state).toBe(7);
    expect(result.current.canRedo).toBe(false);
  });
});

describe('useHistory Extended Tests', () => {
  it('should handle multiple undo and redo operations', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(2);
      result.current.set(3);
      result.current.set(4);
    });
    act(() => {
      result.current.undo();
      result.current.undo();
    });
    expect(result.current.state).toBe(2);
    act(() => {
      result.current.redo();
    });
    expect(result.current.state).toBe(3);
  });

  it('should handle setting the same value multiple times', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(1);
      result.current.set(1);
    });
    expect(result.current.state).toBe(1);
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(0);
  });

  it('should handle undoing all the way back to initial state', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(2);
      result.current.set(3);
    });
    act(() => {
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it('should handle redoing all the way forward after undoing everything', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(2);
      result.current.set(3);
    });
    act(() => {
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });
    act(() => {
      result.current.redo();
      result.current.redo();
      result.current.redo();
    });
    expect(result.current.state).toBe(3);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle alternating between undo and redo', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(2);
    });
    act(() => {
      result.current.undo();
      result.current.redo();
      result.current.undo();
      result.current.redo();
    });
    expect(result.current.state).toBe(2);
  });

  it('should handle clearing history after multiple operations', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(2);
      result.current.undo();
      result.current.set(3);
      result.current.clear();
    });
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle setting state to undefined', () => {
    const { result } = renderHook(() => useHistory<number | undefined>(0));
    act(() => {
      result.current.set(1);
      result.current.set(undefined);
      result.current.set(2);
    });
    expect(result.current.state).toBe(2);
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(1);
  });

  it('should work with boolean values', () => {
    const { result } = renderHook(() => useHistory(false));
    act(() => {
      result.current.set(true);
      result.current.set(false);
      result.current.set(true);
    });
    expect(result.current.state).toBe(true);
    act(() => {
      result.current.undo();
      result.current.undo();
    });
    expect(result.current.state).toBe(true);
  });

  it('should work with array values', () => {
    const { result } = renderHook(() => useHistory<number[]>([]));
    act(() => {
      result.current.set([1]);
      result.current.set([1, 2]);
      result.current.set([1, 2, 3]);
    });
    expect(result.current.state).toEqual([1, 2, 3]);
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toEqual([1, 2]);
  });

  it('should handle nested object mutations', () => {
    interface NestedState {
      a: number;
      b: { c: string; d: boolean };
    }
    const initialState: NestedState = { a: 1, b: { c: 'hello', d: false } };
    const { result } = renderHook(() => useHistory<NestedState>(initialState));
    act(() => {
      result.current.set({ ...result.current.state, a: 2 });
      result.current.set({ ...result.current.state, b: { ...result.current.state.b, c: 'world' } });
    });
    expect(result.current.state).toEqual({ a: 2, b: { c: 'world', d: false } });
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toEqual({ a: 2, b: { c: 'hello', d: false } });
  });

  it('should handle very large number of state changes', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      for (let i = 1; i <= 1000; i++) {
        result.current.set(i);
      }
    });
    expect(result.current.state).toBe(1000);
    act(() => {
      for (let i = 0; i < 500; i++) {
        result.current.undo();
      }
    });
    expect(result.current.state).toBe(500);
    act(() => {
      for (let i = 0; i < 250; i++) {
        result.current.redo();
      }
    });
    expect(result.current.state).toBe(750);
  });

  it('should maintain correct state when mixing set, undo, and redo operations', () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.set(1);
      result.current.set(2);
      result.current.undo();
      result.current.set(3);
      result.current.undo();
      result.current.redo();
      result.current.set(4);
    });
    expect(result.current.state).toBe(4);
    act(() => {
      result.current.undo();
      result.current.undo();
    });
    expect(result.current.state).toBe(1);
  });

  it('should handle Date objects correctly', () => {
    const initialDate = new Date('2023-01-01');
    const { result } = renderHook(() => useHistory(initialDate));
    const secondDate = new Date('2023-02-01');
    const thirdDate = new Date('2023-03-01');
    act(() => {
      result.current.set(secondDate);
      result.current.set(thirdDate);
    });
    expect(result.current.state).toBe(thirdDate);
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toEqual(secondDate);
    act(() => {
      result.current.redo();
    });
    expect(result.current.state).toEqual(thirdDate);
  });
});

describe('batch', () => {
  test('batch updates', () => {
    const { result } = renderHook(() => useHistory({ count: 0, name: '' }));

    act(() => {
      result.current.batch((state) => ({ ...state, count: state.count + 1, name: 'Test' }));
    });

    expect(result.current.state).toEqual({ count: 1, name: 'Test' });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });
});

describe('snapshot', () => {
  test('take and restore snapshot', () => {
    const { result } = renderHook(() => useHistory({ count: 0, name: '' }));

    act(() => {
      result.current.set({ count: 1, name: 'First' });
      result.current.set({ count: 2, name: 'Second' });
    });

    let snapshot: HistorySnapshot<{ count: number; name: string }>;
    act(() => {
      snapshot = result.current.takeSnapshot();
      expect(snapshot.present).toEqual({ count: 2, name: 'Second' });
      expect(snapshot.past).toHaveLength(2);
    });

    act(() => {
      result.current.set({ count: 3, name: 'Third' });
      result.current.restoreSnapshot(snapshot);
    });

    expect(result.current.state).toEqual({ count: 2, name: 'Second' });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });
});