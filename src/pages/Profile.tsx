import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import { fetchUsers, updateUser } from "../features/users/users.slice";
import ServerError from "./ServerError";
import { showToast } from "../features/toast/toast.slice";

type FormData = {
  name?: string;
  email?: string;
  avatar?: File | null;
  bio?: string;
};

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error } = useAppSelector((state) => state.users);

  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // const {
  //   control,
  //   register,
  //   getValues,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm<ProfileFormData>({
  //   defaultValues: {
  //     name: user?.name || "",
  //     email: user?.email || "",
  //     bio: user?.bio || "",
  //   },
  // });
  const {
    control,
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
      setPreviewImage(user.avatar || null);
    }
  }, [user, reset]);
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("avatar", file);
    }
  };

  const handleEditOrSubmit = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      const data = getValues();
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.bio) formData.append("bio", data.bio);
      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }

      await dispatch(fetchUsers());
      const resultAction = await dispatch(updateUser(formData));

      if (updateUser.fulfilled.match(resultAction)) {
        setEditMode(false);
      }

      if (updateUser.rejected.match(resultAction)) {
        console.error("Update failed", resultAction.payload);
        dispatch(
          showToast({
            message: resultAction.payload || "Something went wrong",

            severity: "error",
          })
        );
      }
    }
  };
  if (error) {
    return <ServerError />;
  }
  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }} flex={4}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <form>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={4}
            alignItems={isMobile ? "center" : "flex-start"}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={previewImage || user?.avatar}
                sx={{ width: 140, height: 140, mb: 2 }}
              />
              {editMode && (
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    {...register("avatar")}
                    onChange={handleImagePreview}
                  />
                </Button>
              )}
            </Box>

            <Box flex={1} width="100%">
              <Typography variant="h5" fontWeight="bold" mb={2}>
                {editMode
                  ? "Edit Profile"
                  : `${
                      user?.name
                        ? `${user.name
                            .charAt(0)
                            .toUpperCase()}${user.name.slice(1)} 's`
                        : "Your"
                    } Profile`}
              </Typography>

              <Stack spacing={2}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      label="Full Name"
                      fullWidth
                      disabled={!editMode}
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
                      disabled={!editMode}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Bio"
                      fullWidth
                      multiline
                      rows={4}
                      disabled={!editMode}
                      {...field}
                    />
                  )}
                />
              </Stack>

              <Box mt={4} display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={
                    !loading && (editMode ? <SaveIcon /> : <EditIcon />)
                  }
                  onClick={handleEditOrSubmit}
                  fullWidth
                  disabled={loading} // ✅ Disable during loading
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : editMode ? (
                    "Save Changes"
                  ) : (
                    "Edit Profile"
                  )}
                </Button>
                {error && (
                  <Box mt={2}>
                    <Alert severity="error">{error}</Alert>
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
