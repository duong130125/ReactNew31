import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { TodoLists } from "../../interface";

const initialState: { todo: TodoLists[] } = {
  todo: [],
};

// hàm hiện thị tất cả todo
export const getTodo:any = createAsyncThunk("todo/getAllTodo", async () => {
  const response = await axios.get("http://localhost:8080/TodoList");
  return response.data;
});

// hàm thêm mới todo
export const addTodo:any = createAsyncThunk("todo/addTodo", async (todo: TodoLists) => {
  const response = await axios.post("http://localhost:8080/TodoList", todo);
  return response.data;
});

// hàm checkbox todo
export const checkboxTodo:any = createAsyncThunk("todo/checkTodo", async (id: number) => {
  const response = await axios.get(`http://localhost:8080/TodoList/${id}`);
  const updatedTodo = { ...response.data, status: !response.data.status };
  await axios.put(`http://localhost:8080/TodoList/${id}`, updatedTodo);
  return updatedTodo;
});

// hàm xóa todo
export const deleteTodo:any = createAsyncThunk("todo/deleteTodo", async (id: number) => {
  await axios.delete(`http://localhost:8080/TodoList/${id}`);
  return id;
});

// hàm cập nhật todo
export const updateTodo:any = createAsyncThunk("todo/updateTodo", async (todo: TodoLists) => {
  const response = await axios.put(`http://localhost:8080/TodoList/${todo.id}`, todo);
  return response.data;
});

const todoReducer = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodo.fulfilled, (state, action) => {
        state.todo = action.payload;
      })

      .addCase(addTodo.fulfilled, (state, action) => {
        state.todo.push(action.payload);
      })

      .addCase(checkboxTodo.fulfilled, (state, action) => {
        const index = state.todo.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todo[index] = action.payload;
        }
      })

      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todo = state.todo.filter((todo) => todo.id !== action.payload);
      })

      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todo.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todo[index] = action.payload;
        }
      });
  },
});

export default todoReducer.reducer;
