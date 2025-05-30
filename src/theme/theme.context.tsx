import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  type ReactNode,
} from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

interface ThemeContextType {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used inside ThemeProviderWrapper");
  return context;
};

interface Props {
  children: ReactNode;
}

export const ThemeProviderWrapper: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("colorMode");
    return stored === "light" || stored === "dark" ? stored : "light";
  });

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("colorMode", newMode);
  };

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
