import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import type { Comment } from "../features/comments/comments.types";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import {
  createComment,
  deleteComment,
  fetchComments,
  updateComment,
} from "../features/comments/comments.slice";

export const CommentSection = ({ postId }: { postId: string }) => {
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);
  const postComments =
    useAppSelector((state) => state.comments.comments[postId]) || [];

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    dispatch(createComment({ post: postId, text: commentText }));
    setCommentText("");
  };

  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingText(content);
  };

  const handleEditSubmit = () => {
    if (editingId && editingText.trim()) {
      dispatch(
        updateComment({ post: postId, commentId: editingId, text: editingText })
      );
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleDelete = (commentId: string) => {
    setCommentToDelete(commentId);
    setConfirmDeleteOpen(true);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          borderColor: "divider",
          my: 4,
          overflow: "hidden",
        }}
      >
        <CardHeader
          title="💬 Comments"
          titleTypographyProps={{ fontWeight: 700, variant: "h6" }}
          sx={{ pb: 0, bgcolor: "background.default", px: 3, pt: 2 }}
        />

        <CardContent sx={{ pt: 1, px: 3 }}>
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              multiline
              minRows={1}
              maxRows={4}
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!commentText.trim()}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Add
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List disablePadding>
            {postComments.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ py: 3, fontStyle: "italic" }}
              >
                No comments yet. Be the first to share your thoughts 💡
              </Typography>
            )}

            {postComments.map((comment: Comment) => (
              <ListItem
                key={comment._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  px: 0,
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "grey.300",
                      borderRadius: 2,
                      px: 2,
                      py: 1.5,
                      boxShadow: 1,
                    }}
                  >
                    {editingId === comment._id ? (
                      <TextField
                        fullWidth
                        size="small"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={(e) =>
                          e.key === "Enter" && !e.shiftKey && handleEditSubmit()
                        }
                        multiline
                        minRows={1}
                        maxRows={4}
                        autoFocus
                        variant="outlined"
                      />
                    ) : (
                      <>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.primary",
                            fontSize: "0.95rem",
                            whiteSpace: "pre-line",
                            mb: 1,
                          }}
                        >
                          {comment.text}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "text.secondary",
                            fontStyle: "italic",
                          }}
                        >
                          by{" "}
                          <Box
                            component="span"
                            sx={{ color: "primary.main", fontWeight: 600 }}
                          >
                            {comment.author.name}
                          </Box>{" "}
                          • {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    )}
                  </Box>

                  {user?._id === comment.author._id && (
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                      <IconButton
                        size="small"
                        aria-label="edit comment"
                        onClick={() => handleEdit(comment._id, comment.text)}
                      >
                        <Edit fontSize="small" sx={{ color: "#3b82f6" }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="delete comment"
                        onClick={() => handleDelete(comment._id)}
                      >
                        <Delete fontSize="small" sx={{ color: "#ef4444" }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "text.primary",
            pb: 0,
          }}
        >
          ⚠️ Confirm Deletion
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography color="text.secondary">
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-end" }}>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            variant="outlined"
            color="primary"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (commentToDelete) {
                dispatch(deleteComment({ postId, commentId: commentToDelete }));
              }
              setConfirmDeleteOpen(false);
              setCommentToDelete(null);
            }}
            variant="contained"
            color="error"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
