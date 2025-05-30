import React, { useState, useCallback, useEffect } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Close, Image } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import {
  createPost,
  updatePost,
  fetchPosts,
  setFeedView,
} from "../features/posts/posts.slice";
import { styled } from "@mui/system";
import type { Post } from "../features/posts/posts.types";
import { showToast } from "../features/toast/toast.slice";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

type FormData = {
  title: string;
  content: string;
  image: string;
};

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  editData?: Post | null;
};

const CustomModal: React.FC<Props> = ({ open, setOpen, editData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: { title: "", content: "", image: "" },
  });

  useEffect(() => {
    if (open && editData) {
      setValue("title", editData.title);
      setValue("content", editData.content);
      setEditImageUrl(editData.image || null);
      setFiles([]);
    } else if (open && !editData) {
      reset({ title: "", content: "", image: "" });
      setFiles([]);
      setEditImageUrl(null);
    }
  }, [open, editData, reset, setValue]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setEditImageUrl(null);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      if (files.length > 0) {
        formData.append("image", files[0]);
      } else if (editData && !editImageUrl) {
        formData.append("image", "null");
      }

      if (editData) {
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
        if (!editData._id) {
          throw new Error("Post ID is missing for update operation.");
        }
        await dispatch(
          updatePost({
            postId: editData._id,
            data: formData,
          })
        ).unwrap();

        dispatch(
          showToast({
            message: "Post updated successfully!",

            severity: "success",
          })
        );
      } else {
        if (files[0]) {
          formData.append("image", files[0]);
        }
        if (user) {
          formData.append("author", user?._id);
        }

        if (user)
          await dispatch(
            createPost({ ...data, image: files[0], author: user?._id })
          ).unwrap();
        dispatch(setFeedView("home"));

        dispatch(
          showToast({
            message: "Post created successfully!",

            severity: "success",
          })
        );
      }

      await dispatch(fetchPosts());
      setFiles([]);
      reset();
      setOpen(false);
      setEditImageUrl(null);
    } catch (err: any) {
      dispatch(
        showToast({
          message: err || "Something went wrong",

          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledModal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
          setFiles([]);
          setEditImageUrl(null);
        }}
      >
        <Box
          width={{ xs: "70vw", md: "50vw" }}
          p={3}
          bgcolor="background.default"
          color="text.primary"
          borderRadius={5}
        >
          <Stack spacing={2}>
            <Typography variant="h6" textAlign="center" color="gray">
              {editData ? "Edit Post" : "Create Post"}
            </Typography>

            <UserBox>
              <Avatar
                src={user?.avatar || "logo.svg"}
                sx={{ width: 30, height: 30 }}
              />
              <Typography fontWeight={500} variant="caption">
                {user?.name || "Anonymous"}
              </Typography>
            </UserBox>

            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="What's on your mind?"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
            />

            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed gray",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: isDragActive ? "action.hover" : "inherit",
              }}
            >
              <input {...getInputProps()} />
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Image color="secondary" />
                <Typography>
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag & drop or click to upload media"}
                </Typography>
              </Stack>
            </Box>

            <Stack direction="row" gap={2} flexWrap="wrap">
              {files.length > 0 &&
                files.map((file, index) => (
                  <Box key={index} position="relative">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={80}
                        height={80}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        width={120}
                        height={80}
                        controls
                        style={{ borderRadius: 8 }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => removeFile(index)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "white",
                        border: "1px solid lightgray",
                        p: 0.5,
                        "&:hover": { bgcolor: "lightgray" },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

              {files.length === 0 && editImageUrl && (
                <Box position="relative">
                  <img
                    src={editImageUrl}
                    alt="existing"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setEditImageUrl(null)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "white",
                      border: "1px solid lightgray",
                      p: 0.5,
                      "&:hover": { bgcolor: "lightgray" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Stack>

            <ButtonGroup
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                borderRadius: 2,
                boxShadow: 3,
                "& .MuiButton-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  py: 1.2,
                },
                "& .MuiButton-containedSecondary": {
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#d5d5d5",
                  },
                },
                "& > button:not(:last-child)": {
                  marginRight: 1,
                },
              }}
            >
              <Button
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                sx={{ minWidth: 100 }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : editData ? (
                  "Update"
                ) : (
                  "Post"
                )}
              </Button>
              <Button
                color="secondary"
                onClick={() => setOpen(false)}
                sx={{ minWidth: 100 }}
                disabled={loading}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>
      </StyledModal>
    </>
  );
};

export default CustomModal;
