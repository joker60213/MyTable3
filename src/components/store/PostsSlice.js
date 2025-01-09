import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Асинхронный запрос получения данных. Формат: sliceName/actionName
export const fetchPosts = createAsyncThunk ('posts/fetchPosts', async () => {
    const response = await axios.get ('https://jsonplaceholder.typicode.com/posts');
    return response.data;
});

const postsSlice = createSlice ({
    name: 'posts', //имя слайса для генерации акшинов

    initialState: { //описывает начальное состояние для слайса. Это состояние сохраняется в Redux-хранилище.
        items: [], //сюда будут загружаться посты
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase (fetchPosts.pending, (state) => {
            state.status = 'loading'; // Устанавливаем статус загрузки      
        })
        .addCase (fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'; //даные загруженны
            state.items = action.payload; //сохроняем данные
        })
        .addCase (fetchPosts.rejected, (state, action) => {
            state.status = 'failed'; //Ошибка загрузки
            state.error = action.error.message; // Сохраняем сообщение об ошибке
        });
    },
});

export default postsSlice.reducer;