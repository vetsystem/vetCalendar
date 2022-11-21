import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import SideMenu from "./SideMenu";
import { ThemeProvider } from "@mui/material/styles";
import customTheme from "./theme";
import CalToolbar from "./CalToolbar";
import Content from "./Content";

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <CalToolbar />
        <SideMenu />
        <Content />
      </Box>
    </ThemeProvider>
  );
}

export default App;
