import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import { clearError, login } from "../features/auth/auth.slice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FormData = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const defaultValues = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      reset();
      navigate("/");
    }
  };
  if (error) {
    console.log(error, 88888888);
    // return
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor:
          theme.palette.mode === "light" ? "#f5f5f5" : "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "60vw", md: "100vw" },
          // width: "100vw",
          maxWidth: 900,
          borderRadius: 2,
          overflow: "hidden",
          height: "70vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            backgroundImage: "url(social.avif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 6 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              theme.palette.mode === "light" ? "#fff" : "background.paper",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              mb={1}
              textAlign="center"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={4}
              textAlign="center"
            >
              Please login to continue
            </Typography>

            <Stack
              component="form"
              spacing={3}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              {error && (
                <Typography color="error" variant="body2" textAlign="center">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.5, fontWeight: 600 }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Typography variant="body2" textAlign="center">
                Don’t have an account?{" "}
                <MuiLink
                  onClick={() => dispatch(clearError())}
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
