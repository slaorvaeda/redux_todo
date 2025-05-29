import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
  filter: 'all', // all | completed | active
  search: '',
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action) {
        state.todos.push(action.payload);
      },
      prepare(text) {
        return {
          payload: {
            id: nanoid(),
            text,
            completed: false,
          },
        };
      },
    },
    toggleTodo: (state, action) =>{
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo:(state, action) =>{
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearch: (state, action) =>{
      state.search = action.payload;
    },
    reorderTodos(state, action) {
        // action.payload is { sourceIndex, destinationIndex }
        const { sourceIndex, destinationIndex } = action.payload;
        const [movedTodo] = state.todos.splice(sourceIndex, 1);
        state.todos.splice(destinationIndex, 0, movedTodo);
      },
  },
});

export const { addTodo, toggleTodo, deleteTodo, setFilter, setSearch ,reorderTodos} = todosSlice.actions;
export default todosSlice.reducer;
