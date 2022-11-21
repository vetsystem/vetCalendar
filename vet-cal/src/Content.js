import { Box, Toolbar, Typography } from "@mui/material";
import * as React from "react";

function Content() {
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
    >
      <Toolbar />
      <Typography>Lrem</Typography>
    </Box>
  );
}

export default Content;
