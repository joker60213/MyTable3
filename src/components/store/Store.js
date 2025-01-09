import { configureStore } from "@reduxjs/toolkit";
import postsReducer from './PostsSlice'

const store = configureStore ({
    reducer: {
        posts: postsReducer,
    },
});

export default store;
//создал стор