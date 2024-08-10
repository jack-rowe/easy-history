import { useState, useCallback, useMemo } from "react";
import { History, HistorySnapshot } from "./history"; // Adjust this import path as needed

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function useHistory<T>(
  initialState: T,
  options?: {
    maxSize?: number;
    isEqual?: (a: T, b: T) => boolean;
  }
) {
  const history = useMemo(
    () =>
      new History<T>(
        deepClone(initialState),
        options?.maxSize,
        options?.isEqual
      ),
    []
  );
  
  const [currentValue, setCurrentValue] = useState(history.present);

  const set = useCallback((newValue: T) => {
    history.present = deepClone(newValue);
    setCurrentValue(history.present);
  }, []);

  const undo = useCallback(() => {
    history.undo();
    setCurrentValue(history.present);
  }, []);

  const redo = useCallback(() => {
    history.redo();
    setCurrentValue(history.present);
  }, []);

  const clear = useCallback(() => {
    history.clear();
    setCurrentValue(history.present);
  }, []);

  const batch = useCallback((updateFn: (currentState: T) => T) => {
    history.batch(state => deepClone(updateFn(state)));
    setCurrentValue(history.present);
  }, []);

  const takeSnapshot = useCallback((): HistorySnapshot<T> => {
    return history.takeSnapshot();
  }, []);

  const restoreSnapshot = useCallback((snapshot: HistorySnapshot<T>) => {
    history.restoreSnapshot(snapshot);
    setCurrentValue(history.present);
  }, []);


  return {
    state: currentValue,
    set,
    undo,
    redo,
    clear,
    batch,
    takeSnapshot,
    restoreSnapshot,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
