import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { DrawerWidth } from "../SideMenu";
import AddShiftForm from "../../features/shifts/AddShiftForm";

const drawerWidth = DrawerWidth;

export default function ShiftsToolbar() {
  const [open, setOpen] = React.useState(false);
  const addIconRef = React.useRef(null);
  const [openAlert, toggleOpenAlert] = React.useState(false);
  const [resultMsg, setResultMsg] = React.useState("");

  const openForm = (event) => {
    setOpen(true);
  };

  const handleOpenAlert = () => {
    toggleOpenAlert(!openAlert);
  };

  const closeForm = (msg) => {
    setOpen(false);
    if (msg) {
      setResultMsg(msg);
      handleOpenAlert();
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleOpenAlert}
      >
        <Alert
          severity="success"
          variant="filled"
          action={
            <IconButton size="small" onClick={handleOpenAlert}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {resultMsg}
        </Alert>
      </Snackbar>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="hDate">Služby</Typography>
        </Box>

        <IconButton
          color="inherit"
          ref={addIconRef}
          onClick={openForm}
          disabled={open}
        >
          <AddIcon />
        </IconButton>
        <AddShiftForm
          open={open}
          anchorEl={addIconRef.current}
          onClose={closeForm}
        />
      </Toolbar>
    </AppBar>
  );
}
