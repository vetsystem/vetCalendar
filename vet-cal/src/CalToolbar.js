import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import DateSelect from "./DateSelect";
import { Box } from "@mui/material";
import { DrawerWidth } from "./SideMenu";
import NewAppointment from "./NewAppointment";

const drawerWidth = DrawerWidth;

function CalToolbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <DateSelect />
        </Box>
        <NewAppointment />
      </Toolbar>
    </AppBar>
  );
}
export default CalToolbar;
