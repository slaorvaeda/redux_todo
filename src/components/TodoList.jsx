import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo } from '../features/todos/todosSlice';

export default function TodoList() {
  const dispatch = useDispatch();
  const { todos, filter, search } = useSelector(state => state.todos);

  const filteredTodos = todos
    .filter(todo =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    )
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

  return (
    <ul className="space-y-2">
      {filteredTodos.map(todo => (
        <li
          key={todo.id}
          className="flex justify-between items-center border p-2"
        >
          <span
            onClick={() => dispatch(toggleTodo(todo.id))}
            className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => dispatch(deleteTodo(todo.id))}
            className="text-red-500"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
