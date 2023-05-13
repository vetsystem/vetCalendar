import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import AddAppointmentForm from "./AddAppointmentForm";

function NewAppointment() {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef(null);

  const handleFocus = (event) => {
    setOpen(true);
  };

  const closeForm = (event) => {
    setOpen(false);
  };

  const saveAppointment = (event) => {
    closeForm();
  };

  return (
    <>
      <TextField
        sx={{
          "& .MuiInputBase-root": {
            color: "primary.contrastText",
          },
          "& .MuiInputBase-root:hover:not(.Mui-disabled):before": {
            borderBottomColor: "primary.contrastText",
          },
          "& .MuiInputBase-root::before": {
            borderBottomColor: "primary.contrastText",
          },
          "& .MuiInputBase-root::after": {
            borderBottomColor: "primary.contrastText",
          },
          "& .MuiButtonBase-root": { color: "primary.contrastText" },
        }}
        ref={inputRef}
        id="new-appointment"
        variant="standard"
        color="primary"
        placeholder="Nová návštěva"
        onFocus={handleFocus}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={saveAppointment}>
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      ></TextField>
      <AddAppointmentForm
        open={open}
        anchorEl={inputRef.current}
        onClose={closeForm}
      />
    </>
  );
}

export default NewAppointment;
