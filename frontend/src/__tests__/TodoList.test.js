import axios from "axios";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import TodoList from "../components/TodoList";

jest.mock("axios");
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useMutation: jest.fn(),
}));

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithQueryClient = (ui) => {
  const testQueryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    ),
  };
};

describe("TodoList Component with Axios mock", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the loading state", async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // Trả về dữ liệu rỗng
    renderWithQueryClient(<TodoList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders the todo list", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { _id: "1", title: "Test Todo 1", completed: false },
        { _id: "2", title: "Test Todo 2", completed: true },
      ],
    });
    renderWithQueryClient(<TodoList />);

    const title = await screen.findByText("Todolist");
    const todo1 = await screen.findByText("Test Todo 1");
    const todo2 = await screen.findByText("Test Todo 2");

    expect(title).toBeInTheDocument();
    expect(todo1).toBeInTheDocument();
    expect(todo2).toBeInTheDocument();
  });

  test("toggles todo completion", async () => {
    const mockUpdateMutation = jest.fn();

    axios.get.mockResolvedValueOnce({
      data: [{ _id: "1", title: "Test Todo 1", completed: false }],
    });

    useMutation.mockReturnValue({
      mutate: mockUpdateMutation,
    });

    renderWithQueryClient(<TodoList />);

    const todoItem = await screen.findByText("Test Todo 1");
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(mockUpdateMutation).toHaveBeenCalledWith({
      id: "1",
      updates: { completed: true },
    });
  });

  test("deletes a todo", async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ _id: "1", title: "Test Todo 1", completed: false }],
    });

    axios.delete.mockResolvedValueOnce({ data: {} });

    const mockDeleteMutation = jest.fn();
    mockDeleteMutation.mockResolvedValueOnce({ data: {} });

    renderWithQueryClient(<TodoList />);

    const todoItem = await screen.findByText("Test Todo 1");
    const deleteButton = screen.getByText("Delete");

    fireEvent.click(deleteButton);

    expect(axios.delete).toHaveBeenCalledWith("/api/todos/1");

    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
    });
  });
});
