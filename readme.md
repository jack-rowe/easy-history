# Easy History

Easy History is a lightweight, flexible state management solution for React applications that provides undo and redo functionality. It consists of two main components: a `History` class for managing state history, and a `useHistory` hook for easy integration with React components.

## Usage

Here's a basic example of how to use the `useHistory` hook in a React component:

```jsx
import React from 'react';
import { useHistory } from 'easy-history';

function Counter() {
  const { state, set, undo, redo, canUndo, canRedo } = useHistory(0);

  return (
    <div>
      <p>Count: {state}</p>
      <button onClick={() => set(state + 1)}>Increment</button>
      <button onClick={() => set(state - 1)}>Decrement</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```
