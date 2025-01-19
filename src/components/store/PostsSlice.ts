import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Post } from "../../Types/Post";

interface PostsState {
    items: Post[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: PostsState = {
    items: [],
    status: "idle",
    error: null,
};

//Асинхронный запрос получения данных. Формат: sliceName/actionName Thunk для загрузки постов
export const fetchPosts = createAsyncThunk ('posts/fetchPosts', async () => {
    const response = await fetch ('https://jsonplaceholder.typicode.com/posts');
    return (await response.json()) as Post[];
});

const postsSlice = createSlice ({
    name: 'posts', //имя слайса для генерации акшинов

    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase (fetchPosts.pending, (state) => {
            state.status = "loading"; // Устанавливаем статус загрузки      
        })
        .addCase (fetchPosts.fulfilled, (state, action) => {
            state.status = "succeeded"; //даные загруженны
            state.items = action.payload; //сохроняем данные
        })
        .addCase (fetchPosts.rejected, (state, action) => {
            state.status = "failed"; //Ошибка загрузки
            state.error = action.error.message || "Ошибка"; // Сохраняем сообщение об ошибке
        });
    },
});

export default postsSlice.reducer;