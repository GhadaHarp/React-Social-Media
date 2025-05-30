import {
  Article,
  Bookmark,
  Home,
  Share,
  ThumbUp,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import type { FeedView } from "../features/posts/posts.types";
import { setFeedView } from "../features/posts/posts.slice";
import { useNavigate } from "react-router-dom";
import { clearError } from "../features/auth/auth.slice";
import { useEffect } from "react";

const navItems = [
  { text: "Home", icon: <Home />, feedView: "home" },
  { text: "Profile", icon: <VerifiedUser />, feedView: "profile" },
  { text: "My Posts", icon: <Article />, feedView: "posts" },
  { text: "My Likes", icon: <ThumbUp />, feedView: "likes" },
  { text: "My Shares", icon: <Share />, feedView: "shares" },
  { text: "My Bookmarks", icon: <Bookmark />, feedView: "bookmarks" },
];

export const SideBar = ({
  mobileOpen,
  handleDrawerToggle,
}: {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { feedView } = useAppSelector((state) => state.posts);
  const navigate = useNavigate();

  const handleLinkClick = (feedView: FeedView) => {
    if (!isAuthenticated) {
      dispatch(clearError());
      navigate("/login");
      return;
    }
    if (feedView === "profile") {
      navigate("/profile");
      return;
    }
    if (feedView === "home") {
      navigate("/");
      dispatch(setFeedView("home"));
      return;
    }
    navigate("/");
    dispatch(setFeedView(feedView));
    if (!isSmUp) {
      handleDrawerToggle();
    }
  };
  useEffect(() => {
    navigate("/");
  }, [feedView]);
  const drawerContent = (
    <Box sx={{ width: 220, p: 2 }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleLinkClick(item.feedView as FeedView)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 32, color: theme.palette.primary.light }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isSmUp) {
    return (
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
          position: "fixed",
          height: "100vh",
          bgcolor: "background.paper",
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: 1,
          overflowY: "auto",
        }}
      >
        {drawerContent}
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": { width: 220 },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
