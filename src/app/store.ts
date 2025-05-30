import {
  configureStore,
  type Action,
  type ThunkAction,
} from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import postReducer from "../features/posts/posts.slice";
import userReducer from "../features/users/users.slice";
import toastReducer from "../features/toast/toast.slice";
import commentReducer from "../features/comments/comments.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    posts: postReducer,
    toast: toastReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
