import { ListItemIcon } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeContext } from "../theme/theme.context";

const ThemeToggleButton = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <ListItemIcon onClick={toggleColorMode} color="inherit">
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </ListItemIcon>
  );
};

export default ThemeToggleButton;
