import React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";

const filter = createFilterOptions();

export default function AppReasonInput() {
  const [value, setValue] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);
  const [dialogValue, setDialogValue] = React.useState({
    label: "",
    room: "",
    doctor: "",
    duration: "",
  });
  const handleClose = () => {
    setDialogValue({
      label: "",
      room: "",
      doctor: "",
      duration: "",
    });
    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      label: dialogValue.label,
      room: dialogValue.room,
      doctor: dialogValue.doctor,
      duration: parseInt(dialogValue.duration, 10),
    });
    handleClose();
  };

  return (
    <>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                label: newValue,
                room: "",
                doctor: "",
                duration: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              label: newValue.inputValue,
              room: "",
              doctor: "",
              duration: "",
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              label: `+ "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        options={options}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.label;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.label}</li>}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Důvod návštěvy" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Nový důvod návštěvy</DialogTitle>
          <DialogContent>
            <Stack>
              <TextField
                autoFocus
                margin="dense"
                id="label"
                value={dialogValue.label}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    label: event.target.value,
                  })
                }
                label="Důvod návštěvy"
                type="text"
                variant="standard"
              />
              <TextField
                margin="dense"
                id="room"
                value={dialogValue.room}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    room: event.target.value,
                  })
                }
                label="Místnost"
                type="text"
                variant="standard"
              />
              <TextField
                margin="dense"
                id="doctor"
                value={dialogValue.doctor}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    doctor: event.target.value,
                  })
                }
                label="Lékař"
                type="text"
                variant="standard"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Závřít</Button>
            <Button type="submit">Přidat</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const options = [
  {
    label: "očkování",
    room: "ordinace",
    doctor: "MVDr. Jelen",
    duration: "30 min",
  },
  {
    label: "kastrace",
    room: "sál",
    doctor: "MVDr.Novotná",
    duration: "1 hod",
  },
];
