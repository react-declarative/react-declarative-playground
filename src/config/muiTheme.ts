import { createTheme } from "@mui/material";

export const THEME_LIGHT = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#228be6",
    },
    secondary: {
      main: "#228be6",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    background: {
      default: "#f5f5f5",
      paper: "#fff",
    },
  },
});

export default THEME_LIGHT;
