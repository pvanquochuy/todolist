import React, { useState } from "react";
import { UseTodos } from "../hooks/useTodos";
import "./TodoList.css";

const TodoList = () => {
  const [title, setTitle] = useState("");
  const { todos, isLoading, addMutation, updateMutation, deleteMutation } =
    UseTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addMutation.mutate({ title });
      setTitle("");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="todolist-container">
      <h1 className="todolist-header">Todolist</h1>

      <form className="todolist-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="todolist-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo"
        />
        <button type="submit" className="todolist-button">
          Add
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="todolist-item">
            <input
              type="checkbox"
              className="todolist-checkbox"
              checked={todo.completed}
              onChange={() =>
                updateMutation.mutate({
                  id: todo._id,
                  updates: { completed: !todo.completed },
                })
              }
            />
            <span
              className={`todolist-title ${todo.completed ? "completed" : ""}`}
            >
              {todo.title}
            </span>
            <button
              className="todolist-delete-button"
              onClick={() => deleteMutation.mutate(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
