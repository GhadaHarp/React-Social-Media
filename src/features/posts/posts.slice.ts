import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getPostsRequest,
  getPostByIdRequest,
  deletePostRequest,
  updatePostRequest,
  sharePostRequest,
  createPostRequest,
  toggleLikePostRequest,
  fetchUserPostsRequest,
  fetchUserLikesRequest,
  toggleBookmarkPostRequest,
  fetchUserBookmarksRequest,
  fetchUsersharesRequest,
} from "./posts.API";

import type {
  CreatePostPayload,
  FeedView,
  Post,
  PostsState,
} from "./posts.types";

const initialState: PostsState = {
  posts: [],
  loading: {
    fetchingPosts: false,
    likingPost: false,
    sharingPost: false,
    bookmarkingPost: false,
  },
  error: null,
  feedView: "home",
  page: 1,
  hasMore: false,
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await getPostsRequest();
      return res.data.posts;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchPaginatedPosts = createAsyncThunk(
  "posts/fetchPaginated",
  async (page: number = 1, thunkAPI) => {
    try {
      const res = await getPostsRequest(page);
      console.log(res);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const fetchPost = createAsyncThunk(
  "posts/fetchById",
  async (id: string, thunkAPI) => {
    try {
      const res = await getPostByIdRequest(id);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (newPostData: CreatePostPayload, thunkAPI) => {
    try {
      const res = await createPostRequest(newPostData);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create post"
      );
    }
  }
);
interface UpdatePostPayload {
  postId: string;
  data: FormData;
}
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ postId, data }: UpdatePostPayload, thunkAPI) => {
    try {
      const res = await updatePostRequest(postId, data);

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId: string, thunkAPI) => {
    try {
      await deletePostRequest(postId);
      return postId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const sharePost = createAsyncThunk(
  "posts/share",
  async (postId: string, thunkAPI) => {
    try {
      const res = await sharePostRequest(postId);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to share post"
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/like",
  async (postId: string, thunkAPI) => {
    try {
      const res = await toggleLikePostRequest(postId);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to like post"
      );
    }
  }
);
export const bookmarkPost = createAsyncThunk(
  "posts/bookmark",
  async (postId: string, thunkAPI) => {
    try {
      const res = await toggleBookmarkPostRequest(postId);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to bookmark post"
      );
    }
  }
);
export const fetchUserPosts = createAsyncThunk(
  "posts/user/posts",
  async (_, thunkAPI) => {
    try {
      const res = await fetchUserPostsRequest();
      return res.data.posts;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to get posts"
      );
    }
  }
);

export const fetchUserLikes = createAsyncThunk(
  "posts/user/likes",
  async (_, thunkAPI) => {
    try {
      const res = await fetchUserLikesRequest();
      return res.data.posts;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to get Liked Posts"
      );
    }
  }
);

export const fetchUserBookmarks = createAsyncThunk(
  "posts/user/bookmarks",
  async (_, thunkAPI) => {
    try {
      const res = await fetchUserBookmarksRequest();
      return res.data.posts;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to get Liked Posts"
      );
    }
  }
);

export const fetchUserShares = createAsyncThunk(
  "posts/user/shares",
  async (_, thunkAPI) => {
    try {
      const res = await fetchUsersharesRequest();
      return res.data.posts;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to get Shared Posts"
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFeedView: (state, action: PayloadAction<FeedView>) => {
      state.feedView = action.payload;
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading.fetchingPosts = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingPosts = false;
        state.error = action.payload;
      })
      .addCase(fetchPaginatedPosts.pending, (state) => {
        state.loading.fetchingPosts = true;
      })
      .addCase(
        fetchPaginatedPosts.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: { posts: Post[] };
            hasMore: boolean;
          }>
        ) => {
          const newPosts = action.payload.data.posts;
          const uniquePosts = newPosts.filter(
            (newPost) =>
              !state.posts.some((existing) => existing._id === newPost._id)
          );

          state.posts.push(...uniquePosts);
          state.hasMore = action.payload.hasMore;

          if (uniquePosts.length > 0) {
            state.page += 1;
          }

          state.loading.fetchingPosts = false;
        }
      )
      .addCase(fetchPaginatedPosts.rejected, (state, action) => {
        state.loading.fetchingPosts = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(
        fetchUserPosts.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading.fetchingPosts = false;
          state.posts = action.payload;
        }
      )
      .addCase(fetchUserPosts.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingPosts = false;
        state.error = action.payload;
      })

      .addCase(fetchUserLikes.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(
        fetchUserLikes.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading.fetchingPosts = false;
          state.posts = action.payload;
        }
      )
      .addCase(fetchUserLikes.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingPosts = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBookmarks.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(
        fetchUserBookmarks.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading.fetchingPosts = false;
          state.posts = action.payload;
        }
      )
      .addCase(
        fetchUserBookmarks.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading.fetchingPosts = false;
          state.error = action.payload;
        }
      )

      .addCase(fetchUserShares.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(
        fetchUserShares.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading.fetchingPosts = false;
          state.posts = action.payload;
        }
      )
      .addCase(
        fetchUserShares.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading.fetchingPosts = false;
          state.error = action.payload;
        }
      )

      .addCase(createPost.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading.fetchingPosts = false;
        state.posts.unshift(action.payload);
        state.page = 1;
      })
      .addCase(createPost.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingPosts = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updatePost.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading.fetchingPosts = false;
        const index = state.posts.findIndex(
          (p: Post) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
        state.page = 1;
      })
      .addCase(updatePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingPosts = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deletePost.pending, (state) => {
        state.loading.fetchingPosts = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading.fetchingPosts = false;
        state.posts = state.posts.filter((p: Post) => p._id !== action.payload); // maybe return the _id in delete
      })
      .addCase(deletePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading.fetchingPosts = false;
        state.error = action.payload;
      })

      // SHARE
      .addCase(sharePost.pending, (state) => {
        state.loading.sharingPost = true;
        state.error = null;
      })
      .addCase(sharePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading.sharingPost = false;
        state.posts.unshift(action.payload);
      })
      .addCase(sharePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading.sharingPost = false;
        state.error = action.payload;
      })

      .addCase(likePost.pending, (state) => {
        state.loading.likingPost = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading.likingPost = false;
        const index = state.posts.findIndex(
          (p: Post) => p._id === action.payload._id
        );
        console.log(index, "index");
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(likePost.rejected, (state, action: PayloadAction<any>) => {
        state.loading.likingPost = false;
        state.error = action.payload;
      })
      .addCase(bookmarkPost.pending, (state) => {
        state.loading.bookmarkingPost = true;
        state.error = null;
      })
      .addCase(bookmarkPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading.bookmarkingPost = false;
        const index = state.posts.findIndex(
          (p: Post) => p._id === action.payload._id
        );
        console.log(index, "index");
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(bookmarkPost.rejected, (state, action: PayloadAction<any>) => {
        state.loading.bookmarkingPost = false;
        state.error = action.payload;
      });
  },
});
export const { setFeedView, removePost, resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
