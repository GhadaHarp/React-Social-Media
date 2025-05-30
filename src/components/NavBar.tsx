import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Avatar,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../theme/theme.context";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "../features/auth/auth.slice";
import MenuIcon from "@mui/icons-material/Menu";
import { setFeedView } from "../features/posts/posts.slice";

const ThemeToggleButton = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <IconButton onClick={toggleColorMode} color="inherit">
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};
type NavBarProps = {
  onMenuClick: () => void;
};
export const NavBar: React.FC<NavBarProps> = ({ onMenuClick }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const theme = useTheme();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();

    dispatch(logout());
    dispatch(setFeedView("home"));
    navigate("/");
  };
  const handleGoToProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleGoToProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      {isAuthenticated
        ? [
            <MenuItem
              key="profile"
              onClick={() => {
                handleMobileMenuClose();
                handleGoToProfile();
              }}
            >
              Profile
            </MenuItem>,
            <MenuItem
              key="logout"
              onClick={() => {
                handleMobileMenuClose();
                handleLogout();
              }}
            >
              Logout
            </MenuItem>,
          ]
        : [
            <MenuItem
              key="signup"
              onClick={() => {
                handleMobileMenuClose();
                navigate("/signup");
              }}
            >
              Signup
            </MenuItem>,
            <MenuItem
              key="login"
              onClick={() => {
                handleMobileMenuClose();
                navigate("/login");
              }}
            >
              Login
            </MenuItem>,
          ]}
    </Menu>
  );

  function handleLogoClick() {
    navigate("/");
    dispatch(setFeedView("home"));
  }
  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Link to="/" onClick={handleLogoClick}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "white",
            }}
            onClick={onMenuClick}
          >
            <MenuIcon sx={{ display: { sm: "none" } }} />

            <Box
              component="img"
              src="./logo.svg"
              alt="App Logo"
              sx={{
                height: 36,
                width: 36,
                display: { xs: "none", sm: "block" },
                objectFit: "contain",
              }}
            />
          </IconButton>
        </Link>
        <Typography
          variant="h6"
          noWrap
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          ShutterQuil
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <ThemeToggleButton />
          {isAuthenticated ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ display: { xs: "none", md: "block" } }}
              >
                Welcome,{" "}
                {user?.name
                  ? `${user.name
                      .split(" ")[0]
                      .charAt(0)
                      .toUpperCase()}${user.name.split(" ")[0].slice(1)}`
                  : "User"}
              </Typography>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar src={user?.avatar} alt={user?.name || "User"} />
              </IconButton>
            </Box>
          ) : (
            <>
              <Link to={`/login`}>
                <Button variant="contained" color="secondary">
                  Login
                </Button>
              </Link>
              <Link to={`/signup`}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: theme.palette.secondary.light }}
                >
                  Signup
                </Button>
              </Link>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};
