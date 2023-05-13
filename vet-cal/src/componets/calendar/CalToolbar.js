import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import LinearProgress from "@mui/material/LinearProgress";

import { DrawerWidth } from "../SideMenu";
import DateSelect from "./DateSelectToolbar";

function CalToolbar({ schedulerRef, addIconRef, isDataLoading }) {
  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${DrawerWidth}px)`, ml: `${DrawerWidth}px` }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <DateSelect schedulerRef={schedulerRef} />
        </Box>
        <IconButton
          color="inherit"
          ref={addIconRef}
          onClick={() => {
            schedulerRef.current.scheduler.triggerDialog(true, {
              start: null,
              end: null,
            });
          }}
          disabled={isDataLoading}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
      {isDataLoading ? <LinearProgress /> : null}
    </AppBar>
  );
}

export default CalToolbar;
