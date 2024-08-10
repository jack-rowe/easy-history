# Easy History

Easy History is a lightweight, flexible state management solution for React applications that provides undo, redo, batch updates, and snapshotting functionality. It consists of two main components: a `History` class for managing state history, and a `useHistory` hook for easy integration with React components.

## Features

- Undo and redo functionality
- Batch updates for grouping multiple state changes
- Snapshotting for saving and restoring state
- Customizable history size
- Custom equality comparison for state updates

## Usage

Here's an example of how to use the `useHistory` hook in a React component, showcasing the features:

```jsx
import React from 'react';
import { useHistory } from 'easy-history';

function Counter() {
  const { 
    state, 
    set, 
    undo, 
    redo, 
    batch,
    takeSnapshot,
    restoreSnapshot,
    canUndo, 
    canRedo 
  } = useHistory({ count: 0, name: '' });

  const [savedSnapshot, setSavedSnapshot] = React.useState(null);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Name: {state.name}</p>
      <button onClick={() => set({ ...state, count: state.count + 1 })}>Increment</button>
      <button onClick={() => set({ ...state, count: state.count - 1 })}>Decrement</button>
      <button onClick={() => batch(current => ({
        ...current,
        count: current.count + 1,
        name: 'Updated'
      }))}>Batch Update</button>
      <button onClick={() => {
        const snapshot = takeSnapshot();
        setSavedSnapshot(snapshot);
      }}>Save Snapshot</button>
      <button onClick={() => {
        if (savedSnapshot) {
          restoreSnapshot(savedSnapshot);
        }
      }} disabled={!savedSnapshot}>Restore Snapshot</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

## API

### useHistory(initialState, options?)

A React hook that provides history management for your state.

#### Parameters:

- `initialState`: The initial state of your data.
- `options` (optional): An object with the following optional properties:
  - `maxSize`: The maximum number of past states to keep in history (default: Infinity).
  - `isEqual`: A function to determine if two states are equal (default: strict equality).

#### Returns:

An object with the following properties:

- `state`: The current state.
- `set(newState)`: Function to update the state.
- `undo()`: Function to undo the last change.
- `redo()`: Function to redo the last undone change.
- `batch(updateFn)`: Function to perform multiple updates as a single history entry.
- `takeSnapshot()`: Function to save the current state of the history.
- `restoreSnapshot(snapshot)`: Function to restore a previously saved history state.
- `canUndo`: Boolean indicating if undo is possible.
- `canRedo`: Boolean indicating if redo is possible.

## Advanced Usage

### Batch Updates

Use the `batch` function to group multiple state updates into a single history entry:

```javascript
batch((currentState) => ({
  ...currentState,
  count: currentState.count + 1,
  name: 'New Name'
}));
```

### Snapshotting

Save and restore the entire state of the history:

```javascript
// Save a snapshot
const snapshot = takeSnapshot();

// Later, restore the snapshot
restoreSnapshot(snapshot);
```

### Custom Equality Comparison

Provide a custom equality function to control when new history entries are created:

```javascript
const { state, set } = useHistory(
  { count: 0, name: '' },
  { 
    // Only create new history when count changes
    isEqual: (a, b) => a.count === b.count 
  }
);
```