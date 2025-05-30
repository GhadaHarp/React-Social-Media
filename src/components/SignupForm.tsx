import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useTheme,
  Link as MuiLink,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import { clearError, signup } from "../features/auth/auth.slice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const SignupForm: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useAppSelector((state) => state.auth);
  const defaultValues = useMemo(
    () => ({ name: "", email: "", password: "" }),
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
    const result = await dispatch(signup(data));
    if (signup.fulfilled.match(result)) {
      reset();
      navigate("/");
    }
  };

  return (
    <>
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
            // width: "100%",
            width: { xs: "60vw", md: "100vw" },
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
                Create an account
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={4}
                textAlign="center"
              >
                Fill in your details to sign up
              </Typography>

              <Stack
                component="form"
                spacing={3}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      label="Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      {...field}
                    />
                  )}
                />

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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {/* Error Message */}
                {error && (
                  <Typography color="error" variant="body2" textAlign="center">
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
                <Typography variant="body2" align="center">
                  Already have an account?{" "}
                  <MuiLink
                    onClick={() => dispatch(clearError())}
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    color="primary"
                    fontWeight={500}
                  >
                    Login
                  </MuiLink>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
