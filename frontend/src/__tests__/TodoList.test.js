import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UseTodos } from "../hooks/useTodos";
import TodoList from "../components/TodoList";

jest.mock("../hooks/useTodos");

describe("TodoList Component", () => {
  let todosMock, addMutationMock, updateMutationMock, deleteMutationMock;

  beforeEach(() => {
    todosMock = [
      { _id: "1", title: "Test Todo 1", completed: false },
      { _id: "2", title: "Test Todo 2", completed: true },
    ];
    addMutationMock = { mutate: jest.fn() };
    updateMutationMock = { mutate: jest.fn() };
    deleteMutationMock = { mutate: jest.fn() };

    UseTodos.mockReturnValue({
      todos: todosMock,
      isLoading: false,
      addMutation: addMutationMock,
      updateMutation: updateMutationMock,
      deleteMutation: deleteMutationMock,
    });
  });

  test("renders the loading state", () => {
    UseTodos.mockReturnValueOnce({ todos: [], isLoading: true });
    render(<TodoList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders the todo list", () => {
    render(<TodoList />);
    expect(screen.getByText("Todolist")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  test("adds a new todo", async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText("Add a new todo");
    const button = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Todo" } });
    fireEvent.click(button);

    expect(addMutationMock.mutate).toHaveBeenCalledWith({ title: "New Todo" });

    expect(input.value).toBe("");
  });

  test("toggles todo completion", async () => {
    render(<TodoList />);
    const checkbox = screen.getAllByRole("checkbox")[0];

    fireEvent.click(checkbox);

    expect(updateMutationMock.mutate).toHaveBeenCalledWith({
      id: "1",
      updates: { completed: true },
    });
  });

  test("deletes a todo", async () => {
    render(<TodoList />);
    const deleteButton = screen.getAllByText("Delete")[0];

    fireEvent.click(deleteButton);

    expect(deleteMutationMock.mutate).toHaveBeenCalledWith("1");
  });
});
