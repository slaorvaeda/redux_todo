import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  setFilter,
  setSearch,
  reorderTodos,
} from '../todos/todoSlice';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Todos() {
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');
  const { todos, filter, search } = useSelector(state => state.todos);

  // Filter and search logic same as before
  const filteredTodos = todos
    .filter(todo => todo.text.toLowerCase().includes(search.toLowerCase()))
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

  const handleAddTodo = (e) => {
    e.preventDefault();
    const trimmedTodo = newTodo.trim().toLowerCase();
    const isDuplicate = todos.some(todo => todo.text.trim().toLowerCase() === trimmedTodo);

    if (trimmedTodo === '') return;

    if (isDuplicate) {
      alert('This todo already exists!');
    } else {
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  // Handle drag end event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // If dropped in the same position
    if (source.index === destination.index) return;

    // Dispatch reorder action
    dispatch(reorderTodos({ sourceIndex: source.index, destinationIndex: destination.index }));
  };

  return (
    <div className="max-w-lg mx-auto mt-12 px-6 py-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">📝 My Todo List</h1>

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="flex items-center gap-3 mb-6">
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="What's next?"
          className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          Add
        </button>
      </form>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search todos..."
        onChange={e => dispatch(setSearch(e.target.value))}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        {['all', 'active', 'completed'].map(type => (
          <button
            key={type}
            onClick={() => dispatch(setFilter(type))}
            className={`capitalize px-4 py-2 rounded-lg transition-all font-medium ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Draggable Todo List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todosDroppable">
          {(provided) => (
            <ul
              className="space-y-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredTodos.length === 0 ? (
                <li className="text-center text-gray-400 italic">No todos found.</li>
              ) : (
                filteredTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border transition-all ${
                          snapshot.isDragging ? 'shadow-lg bg-blue-50' : ''
                        }`}
                      >
                        <span
                          onClick={() => dispatch(toggleTodo(todo.id))}
                          className={`flex-1 cursor-pointer ${
                            todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                          }`}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => dispatch(deleteTodo(todo.id))}
                          className="ml-4 text-red-500 hover:text-red-600 transition"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
