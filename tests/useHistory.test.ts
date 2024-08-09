import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../src/useHistory';

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