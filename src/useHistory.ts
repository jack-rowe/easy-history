import { useState, useCallback, useMemo } from "react";
import { History } from "./history"; // Adjust this import path as needed

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function useHistory<T>(initialState: T) {
  const history = useMemo(() => new History<T>(deepClone(initialState)), []);
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

  return {
    state: currentValue,
    set,
    undo,
    redo,
    clear,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
