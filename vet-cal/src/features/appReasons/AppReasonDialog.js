import React, { useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DurationInput from "../../componets/inputs/DurationInput";
import RoomInput from "../rooms/RoomInput";
import DoctorInput from "../doctors/DoctorInput";
import { useAddAppReasonMutation } from "./appReasonsSlice";
import { useDispatch } from "react-redux";
import { addCurrAppReason } from "../currApp/currAppSlice";

export default function AppReasonDialog({ newAppReason, open, handleClose }) {
  const dispatch = useDispatch();
  const [addAppReason, result] = useAddAppReasonMutation();

  // Set new appointment reason value into dialog
  const initDialogValue = {
    label: "",
    room: [],
    doctor: [],
    duration: 0,
  };
  const [dialogValue, setDialogValue] = React.useState(initDialogValue);

  useEffect(() => {
    setDialogValue((prevState) => ({ ...prevState, label: newAppReason }));
  }, [newAppReason]);

  const createResource = (dialogValue) => {
    let rooms = [];
    let doctors = [];
    if (dialogValue.room.length !== 0) {
      rooms = dialogValue.room.map((room) => {
        return {
          typeReference: {
            reference: room,
          },
          type: "location",
        };
      });
    }
    if (dialogValue.doctor.length !== 0) {
      doctors = dialogValue.doctor.map((doctor) => {
        return {
          typeReference: {
            reference: doctor,
          },
          type: "practitioner",
        };
      });
    }
    const participants = rooms.concat(doctors);
    const resource = {
      resourceType: "ActivityDefinition",
      name: dialogValue.label,
      timingDuration: {
        value: dialogValue.duration,
        unit: "min",
      },
    };
    if (participants.length !== 0) resource.participant = participants;
    return resource;
  };

  const handleCloseDialog = () => {
    handleClose(false);
    setDialogValue(initDialogValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAppReasonEmpty()) {
      await addAppReason({ resource: createResource(dialogValue) });
      dispatch(addCurrAppReason(dialogValue));
      if (!result.isError) handleCloseDialog();
      else {
        console.log(result.error);
      }
    }
  };

  const isAppReasonEmpty = () => {
    return !dialogValue.label || dialogValue.label === "";
  };

  function onChangeFn(type) {
    const fn = (event, newValue) => {
      if (newValue === null) newValue = [];
      const ids = newValue.map((entry) => entry.id);
      setDialogValue({ ...dialogValue, [type]: ids });
    };
    return fn;
  }

  const setDuration = (event, newValue) => {
    setDialogValue({ ...dialogValue, duration: newValue.duration });
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth={"lg"}>
      <DialogTitle>Nový důvod návštěvy</DialogTitle>
      <DialogContent>
        <Stack>
          <TextField
            autoFocus
            margin="dense"
            id="appReasonInput"
            name="appReason"
            value={dialogValue.label}
            onChange={(event) => {
              setDialogValue({ ...dialogValue, label: event.target.value });
            }}
            label="Důvod návštěvy"
            type="text"
            variant="standard"
            error={isAppReasonEmpty() || result.isError}
            {...(isAppReasonEmpty() || result.isError
              ? { helperText: "Důvod návštěvy musí být vyplněn!" }
              : {})}
          />
          <RoomInput multiple={true} onChangeFn={onChangeFn("room")} />
          <DoctorInput multiple={true} onChangeFn={onChangeFn("doctor")} />
          <DurationInput onChangeFn={setDuration} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Zavřít</Button>
        <Button onClick={handleSubmit}>Přidat</Button>
      </DialogActions>
    </Dialog>
  );
}
