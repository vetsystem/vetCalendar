import * as React from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { v4 as uuidv4 } from "uuid";

import AppDetailForm from "./AppDetailForm";
import PatientDatailForm from "../../../features/patients/PatientDetailForm";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { formatISO } from "date-fns";
import { createFhirResource } from "../../../utils/fhir/fhirUtil";
import { useAddAppMutation } from "../../../features/appointments/appointmentsSlice";

export default function AddAppointmentForm({ onClose, timeSlot, calendarRef }) {
  // Variables for handling appointment data
  const appointmentRef = React.useRef(null);
  // Variables for handling pacient data
  const patientRef = React.useRef(null);
  // Varibles for handling appointment data
  const [addApp, { isLoading }] = useAddAppMutation();
  // Variables for handling data for alert tooltip
  const [alertMsg, setAlertMsg] = React.useState("");
  const [openAlert, setOpenAlert] = React.useState(false);
  /**
   * Function for showing and hiding alert tooltip
   */
  const toogleAlert = () => {
    setOpenAlert(!openAlert);
  };
  /**
   * Variables for handling dialog with question about creating new appointment
   * without scheduled slots
   */
  const [openDialog, setOpenDialog] = React.useState(false);
  const [submitData, setSubmitData] = React.useState(true);
  /**
   * Function for showing and hiding dialog with question about creating new
   * appointment without scheduled slots
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const interuptSubmit = () => {
    setSubmitData(false);
    handleCloseDialog();
  };

  const onAppSubmit = async () => {
    const appData = appointmentRef.current.getAppData();
    const patient = patientRef.current.getPatientData();

    if (
      appData.startDate === null ||
      appData.room.id === "" ||
      appData.duration === 0
    ) {
      setAlertMsg("Je nutné vyplnit datum, místnost a dobu trvání");
      toogleAlert();
      return;
    }

    const slots = await fetch(
      `${
        process.env.REACT_APP_FHIR_LOCAL_SERVER_URL
      }/Slot?schedule.actor:Location=${appData.room.id}&start=ge${formatISO(
        appData.startDate
      )}&start=lt${formatISO(appData?.endDate)}&status=free`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.entry) {
          return [];
        } else {
          return data.entry;
        }
      });

    if (slots.length === 0) setOpenDialog(true);
    if (submitData) {
      const bundleEntries = [];
      if (!patient.id && patient.owner !== "") {
        const patientResource = createFhirResource({
          ...patient,
          resourceType: "Patient",
        });
        const searchUrl = new URL(
          "/Patient",
          process.env.REACT_APP_FHIR_LOCAL_SERVER_URL
        );
        searchUrl.searchParams.set("name", patient.name);
        searchUrl.searchParams.set("birthdate", patient.birthDate);
        patient.id = `urn:uuid:${uuidv4()}`;
        const transactionResource = {
          fullUrl: patient.id,
          resource: patientResource,
          method: "PUT",
          url: `${searchUrl.pathname}${searchUrl.search}`,
        };
        bundleEntries.push(transactionResource);
        console.log(patient);
      }
      if (slots.length > 0) {
        const transactionSlots = slots.map((slot) => ({
          fullUrl: slot.fullUrl,
          resource: { ...slot.resource, status: "busy-unavailable" },
          method: "PUT",
          url: `/Slot/${slot.resource.id}`,
        }));
        bundleEntries.push(...transactionSlots);
      }

      const appointment = createFhirResource({
        resourceType: "Appointment",
        ...appData,
        slots,
        room: { ...appData.room, type: "Location" },
        doctor: { ...appData.doctor, type: "Practitioner" },
        patient: { ...patient, type: "Patient" },
      });

      const transactionAppointment = {
        fullUrl: `urn:uuid:${uuidv4()}`,
        resource: appointment,
        method: "POST",
        url: `/Appointment`,
      };

      bundleEntries.push(transactionAppointment);

      const bundleTransaction = createFhirResource({
        resourceType: "Bundle",
        entries: bundleEntries,
      });
      console.log(bundleTransaction);
      await addApp(bundleTransaction)
        .then(({ data }) => {
          return data.entry.filter(
            (entry) => entry.response.status === "201 Created"
          );
        })
        .then((data) => {
          if (data.length > 0) {
            onClose();
          } else {
            setAlertMsg("Návštěvu se nepodařilo uložit");
            toogleAlert();
          }
        });
    }
  };

  return (
    <>
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
          {alertMsg}
        </Alert>
      </Snackbar>
      {/* Appointment form */}
      <Stack
        spacing={1}
        sx={{
          width: 320,
          p: 2,
          bgcolor: "secondary.main",
        }}
      >
        <AppDetailForm
          calendarRef={calendarRef}
          selectedSlot={timeSlot}
          ref={appointmentRef}
        />
        <Typography variant="caption" mt={3} sx={{ opacity: 0.87 }}>
          Pacient:
        </Typography>
        <PatientDatailForm ref={patientRef} />
        <Stack direction="row" justifyContent="end" spacing={1}>
          <Button onClick={onClose}>Zavřít</Button>
          <LoadingButton
            variant="contained"
            onClick={onAppSubmit}
            loadingPosition="start"
            loading={isLoading}
            startIcon={<SaveIcon />}
          >
            Uložit
          </LoadingButton>
        </Stack>
      </Stack>
      <Dialog open={openDialog} onClose={interuptSubmit}>
        <DialogTitle>{"Neexistující služba"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pro dané parametry neexistuje vypsaná služba nebo ve ve vypsaných
            službách není volné místo. Mám i přesto vytvořit novou návštěvu?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={interuptSubmit}>Ne</Button>
          <Button onClick={handleCloseDialog} autoFocus>
            Ano
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
