/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Comment,
  CommentsState,
  CreateCommentPayload,
  UpdateCommentPayload,
} from "./comments.types";

import {
  createCommentRequest,
  deleteCommentRequest,
  getCommentsRequest,
  updateCommentRequest,
} from "./comments.API";

// ⏳ Initial State
const initialState: CommentsState = {
  comments: {}, // { [postId]: Comment[] }
  loading: {
    fetchingComments: false,
    creatingComment: false,
    deletingComment: false,
    updatingComment: false,
  },
  error: null,
};

// 📥 Fetch Comments
export const fetchComments = createAsyncThunk(
  "comments/fetchByPostId",
  async (postId: string, thunkAPI) => {
    try {
      const res = await getCommentsRequest(postId);
      return {
        post: postId,
        comments: res.data.comments, // assuming it's an array of comments
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

// ➕ Create Comment
export const createComment = createAsyncThunk(
  "comments/create",
  async (payload: CreateCommentPayload, thunkAPI) => {
    try {
      const res = await createCommentRequest(payload);
      console.log(res.data, "get all");

      return {
        post: payload.post,
        comment: res.data,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

// ❌ Delete Comment
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (
    { postId, commentId }: { postId: string; commentId: string },
    thunkAPI
  ) => {
    try {
      await deleteCommentRequest(commentId);
      return { post: postId, commentId };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

// ✏️ Update Comment
export const updateComment = createAsyncThunk(
  "comments/update",
  async (
    { commentId, text, post }: UpdateCommentPayload & { post: string },
    thunkAPI
  ) => {
    try {
      const res = await updateCommentRequest({ commentId, text });

      return {
        post,
        comment: res.data,
      };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

// 🧩 Slice
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    resetComments: (state, action: PayloadAction<string>) => {
      const post = action.payload;
      delete state.comments[post];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchComments.pending, (state) => {
        state.loading.fetchingComments = true;
        state.error = null;
      })
      .addCase(
        fetchComments.fulfilled,
        (
          state,
          action: PayloadAction<{ post: string; comments: Comment[] }>
        ) => {
          state.loading.fetchingComments = false;
          state.comments[action.payload.post] = action.payload.comments;
        }
      )
      .addCase(fetchComments.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingComments = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createComment.pending, (state) => {
        state.loading.creatingComment = true;
        state.error = null;
      })
      .addCase(
        createComment.fulfilled,
        (state, action: PayloadAction<{ post: string; comment: Comment }>) => {
          state.loading.creatingComment = false;
          const { post, comment } = action.payload;
          if (!state.comments[post]) {
            state.comments[post] = [];
          }
          state.comments[post].push(comment);
        }
      )
      .addCase(createComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading.creatingComment = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteComment.pending, (state) => {
        state.loading.deletingComment = true;
        state.error = null;
      })
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<{ post: string; commentId: string }>) => {
          state.loading.deletingComment = false;
          const { post, commentId } = action.payload;
          state.comments[post] = state.comments[post]?.filter(
            (c) => c._id !== commentId
          );
        }
      )
      .addCase(deleteComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading.deletingComment = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateComment.pending, (state) => {
        state.loading.updatingComment = true;
        state.error = null;
      })
      .addCase(
        updateComment.fulfilled,
        (state, action: PayloadAction<{ post: string; comment: Comment }>) => {
          state.loading.updatingComment = false;
          const { post, comment } = action.payload;
          const index = state.comments[post]?.findIndex(
            (c) => c._id === comment._id
          );
          if (index !== undefined && index !== -1) {
            state.comments[post][index] = comment;
          }
        }
      )
      .addCase(updateComment.rejected, (state, action: PayloadAction<any>) => {
        state.loading.updatingComment = false;
        state.error = action.payload;
      });
  },
});

// ✅ Exports
export const { resetComments } = commentsSlice.actions;
export default commentsSlice.reducer;
