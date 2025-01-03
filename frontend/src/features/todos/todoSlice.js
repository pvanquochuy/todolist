import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    setTodos: (state, action) => action.payload,
    addTodo: (state, action) => [...state, action.payload],
    updateTodo: (state, action) =>
      state.map((todo) =>
        todo._id === action.payload._id ? action.payload : todo
      ),
    deleteTodo: (state, action) =>
      state.filter((todo) => todo._id !== action.payload),
  },
});

export const { setTodos, addTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
