// store.js
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../features/todos/todoSlice';

// localStorage functions...

const loadState = () => {
    try {
      const serializedState = localStorage.getItem('todo-state');
      return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (error) {
      console.warn('⚠️ Failed to load state from localStorage:', error);
      return undefined;
    }
  };

  const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('todo-state', serializedState);
    } catch (error) {
      console.warn('⚠️ Failed to save state to localStorage:', error);
    }
  };

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({
    todos: store.getState().todos,
  });
});


