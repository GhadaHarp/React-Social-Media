import {
  createTheme,
  type Palette,
  type PaletteOptions,
} from "@mui/material/styles";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      navbarHeight: string;
      borderRadius: number;
      shadows: {
        light: string;
        medium: string;
        heavy: string;
      };
    };
    palette: Palette;
  }

  interface ThemeOptions {
    custom?: {
      navbarHeight?: string;
      borderRadius?: number;
      shadows?: {
        light?: string;
        medium?: string;
        heavy?: string;
      };
    };
    palette?: PaletteOptions;
  }
}

const customTheme = {
  custom: {
    navbarHeight: "64px",
    borderRadius: 12,
    shadows: {
      light: "0 1px 3px rgba(0,0,0,0.1)",
      medium: "0 3px 6px rgba(0,0,0,0.15)",
      heavy: "0 10px 20px rgba(0,0,0,0.2)",
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6e3df1",
      light: "#a088f5",
      dark: "#4b1dbf",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c126bf",
      light: "#da7dd9",
      contrastText: "#ffffff",
    },
    error: {
      main: red.A400,
    },
    success: {
      main: "#10B981",
    },
    warning: {
      main: "#ef8132",
    },
    info: {
      main: "#3B82F6",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
    divider: "#E2E8F0",
  },
  ...customTheme,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9e86fa",
      light: "#b8a9ff",
      dark: "#5a3ea0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#d46ce0",
      light: "#f0b1f7",
      contrastText: "#ffffff",
    },
    error: {
      main: red[300],
    },
    success: {
      main: "#22c55e",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#60a5fa",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#F1F5F9",
      secondary: "#A0AEC0",
    },
    divider: "#374151",
  },
  ...customTheme,
});
