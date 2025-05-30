import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  Delete,
  Edit,
  FavoriteBorder,
  ShareOutlined,
} from "@mui/icons-material";
import type { Post } from "../features/posts/posts.types";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import {
  bookmarkPost,
  deletePost,
  fetchPost,
  likePost,
  removePost,
  sharePost,
} from "../features/posts/posts.slice";
import CustomModal from "./CustomModal";
import { showToast } from "../features/toast/toast.slice";
import { CommentSection } from "./CommnentSection";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [editData, setEditData] = React.useState<Post | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [postToDelete, setPostToDelete] = React.useState<string | null>(null);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { error, feedView } = useAppSelector((state) => state.posts);
  const [liked, setLiked] = React.useState(
    post.likes?.includes(user?._id as string)
  );
  const [bookmarked, setBookmarked] = React.useState(
    post.bookmarks?.includes(user?._id as string)
  );
  const [shared] = React.useState(post.sharedBy?.includes(user?._id as string));
  const [shareCount, setShareCount] = React.useState(post.shareCount || 0);
  const [likeCount, setLikeCount] = React.useState(post.likeCount || 0);
  const [bookmarkCount, setBookmarkCount] = React.useState(
    post.bookmarkCount || 0
  );
  const [commentsOpen, setCommentsOpen] = React.useState(false);

  const toggleComments = () => setCommentsOpen((prev) => !prev);
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditData(post);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleLikeClick = async () => {
    if (!post._id || !user?._id) return;

    const wasLiked = liked;
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked((prev) => !prev);

    try {
      await dispatch(likePost(post._id)).unwrap();

      if (feedView === "likes" && wasLiked) {
        dispatch(removePost(post._id));
      }
    } catch (error) {
      console.log(error);
      setLiked(wasLiked);
      dispatch(
        showToast({
          message: "Failed to like post",
          severity: "error",
        })
      );
    }
  };
  const handleBookmarkClick = async () => {
    if (!post._id || !user?._id) return;

    const wasBookmarked = bookmarked;
    if (bookmarked) {
      setBookmarkCount((c) => c - 1);
    } else {
      setBookmarkCount((c) => c + 1);
    }
    setBookmarked((prev) => !prev);

    try {
      await dispatch(bookmarkPost(post._id)).unwrap();

      if (feedView === "bookmarks" && wasBookmarked) {
        dispatch(removePost(post._id));
      }
    } catch (error) {
      console.log(error);
      setLiked(wasBookmarked);
      dispatch(
        showToast({
          message: "Failed to Bookmark post",
          severity: "error",
        })
      );
    }
  };
  const handleShareClick = async () => {
    setShareCount((c) => c + 1);
    try {
      if (post._id) {
        await dispatch(sharePost(post._id)).unwrap();
        await dispatch(fetchPost(post._id));
        if (feedView === "shares") {
          dispatch(removePost(post._id));
        }
        dispatch(
          showToast({
            message: "Post Shared Successfully!",
            severity: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (error)
    return (
      <Card sx={{ margin: 5, p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Failed to load post.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please check your connection or try again later.
        </Typography>
      </Card>
    );

  return (
    <>
      <Card sx={{ margin: 2 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500] }}
              aria-label="author"
              src={post.author?.avatar}
            >
              {post.author?.avatar ?? post.author?.name?.charAt(0)}
            </Avatar>
          }
          action={
            isAuthenticated && user?._id === post.author?._id ? (
              <>
                <IconButton aria-label="settings" onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleEditClick}>
                    <Edit sx={{ mr: 1 }} />
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setPostToDelete(post._id!);
                      setConfirmDeleteOpen(true);
                      handleMenuClose();
                    }}
                  >
                    <Delete sx={{ mr: 1 }} />
                    Delete
                  </MenuItem>
                </Menu>
              </>
            ) : null
          }
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1">
                {post.author?.name ?? "Anonymous"}
              </Typography>

              {isAuthenticated && user && (
                <>
                  {user._id === post.author?._id &&
                  !post.sharedBy?.includes(user._id) ? (
                    <Chip
                      label="Your Post"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 22 }}
                    />
                  ) : post.sharedBy?.includes(user._id) ? (
                    <Chip
                      label={`You shared`}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 22 }}
                    />
                  ) : null}
                </>
              )}
            </Box>
          }
          subheader={
            post.createdAt
              ? new Date(post.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""
          }
        />

        {post.image && (
          <CardMedia
            component="img"
            height="400"
            image={post.image}
            alt="Post"
          />
        )}

        <CardContent>
          <Typography variant="body1" sx={{ color: "text.primary" }}>
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {post.content}
          </Typography>
        </CardContent>

        {isAuthenticated && (
          <CardActions
            disableSpacing
            sx={{ justifyContent: "space-between", px: 2 }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              {/* Like */}
              <Box display="flex" alignItems="center">
                <IconButton aria-label="like" onClick={handleLikeClick}>
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<FavoriteIcon sx={{ color: "red" }} />}
                    checked={liked}
                  />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {likeCount || 0}
                </Typography>
              </Box>

              {/* Share */}
              <Box display="flex" alignItems="center">
                <IconButton aria-label="share" onClick={handleShareClick}>
                  <Checkbox
                    icon={<ShareOutlined sx={{ color: "gray" }} />}
                    checkedIcon={<ShareIcon sx={{ color: "green" }} />}
                    checked={shared}
                  />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {shareCount || 0}
                </Typography>
              </Box>
              <Button size="small" onClick={toggleComments}>
                {commentsOpen ? "Hide Comments" : "Show Comments"}
              </Button>
            </Box>

            {/* Bookmark */}
            <Box display="flex" alignItems="center">
              <IconButton aria-label="bookmark" onClick={handleBookmarkClick}>
                <Checkbox
                  icon={<BookmarkBorder />}
                  checkedIcon={<Bookmark sx={{ color: "#f59e0b" }} />}
                  checked={bookmarked}
                />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {bookmarkCount || 0}
              </Typography>
            </Box>
          </CardActions>
        )}
      </Card>
      <CustomModal
        open={openModal}
        setOpen={setOpenModal}
        editData={editData}
      />

      <Collapse in={commentsOpen} timeout="auto" unmountOnExit>
        <CardContent>
          {isAuthenticated && post._id && <CommentSection postId={post._id} />}
        </CardContent>
      </Collapse>
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
            Are you sure you want to delete this post? This action cannot be
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
              if (postToDelete) {
                dispatch(deletePost(postToDelete));
                dispatch(
                  showToast({
                    message: "Post deleted successfully!",
                    severity: "success",
                  })
                );
              }
              setConfirmDeleteOpen(false);
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
