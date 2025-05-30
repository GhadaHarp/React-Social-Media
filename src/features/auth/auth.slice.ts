import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { loginRequest, signupRequest, verifyTokenRequest } from "./auth.API";
import type { AuthState } from "./auth.types";
import type { User } from "../users/users.types";
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
export const loadUserFromToken = () => async (dispatch: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    await dispatch(verifyToken(token));
  }
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (
    formData: { email: string; password: string; name: string },
    thunkAPI
  ) => {
    try {
      const response = await signupRequest(formData);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await loginRequest(credentials);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);
export const verifyToken = createAsyncThunk(
  "auth/verify-token",
  async (token: string, thunkAPI) => {
    try {
      const res = await verifyTokenRequest(token);
      console.log("token", res);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Verifying token failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    updateAuthUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          state.isAuthenticated = true;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;

          state.isAuthenticated = true;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        verifyToken.fulfilled,
        (state, action: PayloadAction<{ user: User; message: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.token = localStorage.getItem("token");
        }
      )
      .addCase(verifyToken.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;
