import React, { useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import DurationInput from "../../componets/inputs/DurationInput";
import RoomInput from "../rooms/RoomInput";
import DoctorInput from "../doctors/DoctorInput";

import { v4 as uuidv4 } from "uuid";

import { useAddAppReasonMutation } from "./appReasonsSlice";
import ActivityDefinitionRes from "../../utils/fhir/activityDefinitionRes";
import { createBundle, createBundleEntry } from "../../utils/fhir/fhirUtil";

export default function AppReasonDialog({
  newAppReason,
  onAppReasonSave,
  open,
  handleClose,
}) {
  // Initial value of dialog input fields for new appointment reason
  const initDialogValue = {
    label: "",
    rooms: [],
    doctors: [],
    duration: 0,
  };
  // Setting state of dialog input fields for new appointment reason
  const [dialogValue, setDialogValue] = React.useState(initDialogValue);
  // Trigger for adding new appointment reason
  const [addAppReason, result] = useAddAppReasonMutation();
  const [errorText, setErrorText] = React.useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  /**
   * Function for showing and hiding alert tooltip
   */
  const toogleAlert = () => {
    setOpenAlert(!openAlert);
  };
  // use new appointment reason label from appointment reason input field in add
  // appointment form
  useEffect(() => {
    setDialogValue({ ...dialogValue, label: newAppReason });
  }, [newAppReason]);
  useEffect(() => {
    if (result.isError) {
      setErrorText("Důvod návštěvy se nepodařilo uložit!");
      toogleAlert();
    }
  }, [result.isError]);
  useEffect(() => {
    if (result.data === "200 OK") {
      setErrorText("Důvod návštěvy s tímto názvem už existuje!");
      toogleAlert();
    } else if (result.isSuccess) {
      onAppReasonSave({
        label: dialogValue.label,
        room: dialogValue.rooms,
        doctor: dialogValue.doctors,
        duration: dialogValue.duration,
      });
      onClose();
    }
  }, [result.isSuccess]);

  const onClose = () => {
    handleClose(false);
    setDialogValue(initDialogValue);
  };

  const onSubmit = (event) => {
    if (!isAppReasonEmpty()) {
      saveAppReason();
    }
  };

  const saveAppReason = () => {
    const resource = ActivityDefinitionRes(
      dialogValue.label,
      dialogValue.duration,
      {
        doctors: dialogValue.doctors,
        rooms: dialogValue.rooms,
      }
    );
    const bundleEntry = createBundleEntry({
      resource: resource,
      method: "POST",
      fullUrl: `urn:uuid:${uuidv4()}`,
      url: "/ActivityDefinition",
      ifNoneExist: `ActivityDefinition?name=${encodeURI(dialogValue.label)}`,
    });
    const bundle = createBundle([bundleEntry]);
    addAppReason(bundle);
  };

  const isAppReasonEmpty = () => {
    return dialogValue.label === "";
  };

  const setLabel = (event) => {
    setDialogValue({ ...dialogValue, label: event.target.value });
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"lg"}>
      {/* Error msg */}
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={toogleAlert}
      >
        <Alert
          severity="error"
          variant="filled"
          action={
            <IconButton size="small" onClick={toogleAlert}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {errorText}
        </Alert>
      </Snackbar>
      <DialogTitle>Nový důvod návštěvy</DialogTitle>
      <DialogContent>
        <Stack>
          <TextField
            autoFocus
            margin="dense"
            id="appReasonInput"
            name="appReason"
            value={dialogValue.label}
            onChange={setLabel}
            label="Důvod návštěvy"
            type="text"
            variant="standard"
            error={dialogValue.label === ""}
            {...(dialogValue.label === ""
              ? { helperText: "Důvod návštěvy musí být vyplněn" }
              : {})}
          />
          <RoomInput multiple={true} onChangeFn={onChangeFn("rooms")} />
          <DoctorInput multiple={true} onChangeFn={onChangeFn("doctors")} />
          <DurationInput onChangeFn={setDuration} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zavřít</Button>
        <LoadingButton
          variant="contained"
          onClick={onSubmit}
          loadingPosition="start"
          loading={result.isLoading}
          startIcon={<SaveIcon />}
        >
          Přidat
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
