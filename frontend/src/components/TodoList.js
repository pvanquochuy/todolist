import React, { useState } from "react";
import { UseTodos } from "../hooks/useTodos";

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
    <div>
      <h1>Todolist</h1>
      <ul>
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new todo"
            style={{ marginRight: "10px", padding: "5px", width: "70%" }}
          />

          <button type="submit" style={{ padding: "5px 10px" }}>
            Add
          </button>
        </form>

        {/* show */}
        <ul>
          {todos.map((todo) => (
            <li key={todo._id} style={{ marginBottom: "10px" }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  updateMutation.mutate({
                    id: todo._id,
                    updates: { completed: !todo.completed },
                  })
                }
                style={{ marginRight: "10px" }}
              />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none", // Gạch ngang nếu todo đã hoàn thành
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteMutation.mutate(todo._id)}
                style={{ marginLeft: "10px", padding: "2px 8px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </ul>
    </div>
  );
};

export default TodoList;
