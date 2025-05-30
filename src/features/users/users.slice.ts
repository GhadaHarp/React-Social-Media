import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getUsersRequest,
  getUserByIdRequest,
  updateUserRequest,
  deleteUserRequest,
} from "./users.API";
import type { User, UsersState } from "./users.types";
import { updateAuthUser } from "../auth/auth.slice";

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentUser: null,
};

const getErrorMessage = (err: any): string =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await getUsersRequest();

    return res.data.users;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const fetchUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/fetchById", async (id, thunkAPI) => {
  try {
    const res = await getUserByIdRequest(id);

    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});
// type FormData = {
//   name?: string;
//   email?: string;
//   avatar?: File | null;
//   bio?: string;
// };
export const updateUser = createAsyncThunk<
  User,
  FormData,
  { rejectValue: string }
>("users/update", async (data, thunkAPI) => {
  try {
    const res = await updateUserRequest(data);
    const updatedUser = await res.data;
    thunkAPI.dispatch(updateAuthUser(updatedUser));
    return updatedUser;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("users/delete", async (userId, thunkAPI) => {
  try {
    await deleteUserRequest(userId);
    return userId;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(
        fetchUsers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        }
      );

    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        console.log("from  fetch user slice", state.currentUser);
      })
      .addCase(
        fetchUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        }
      );

    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;

        state.currentUser = action.payload;
      })
      .addCase(
        updateUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        }
      );

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(
        deleteUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || null;
        }
      );
  },
});

export default usersSlice.reducer;
