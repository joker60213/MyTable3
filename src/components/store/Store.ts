import { configureStore } from "@reduxjs/toolkit";
import postsReducer from './PostsSlice'

const store = configureStore ({
    reducer: {
        posts: postsReducer,
    },
});

// Тип состояния Redux
export type RootState = ReturnType<typeof store.getState>;

// Тип диспетчера Redux
export type AppDispatch = typeof store.dispatch;

export default store;
//создал стор