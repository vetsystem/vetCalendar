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
  createBundle,
  createBundleEntry,
  createFhirResource,
} from "../../../utils/fhir/fhirUtil";
import { useAddAppMutation } from "../../../features/appointments/appointmentsSlice";

export default function AddAppointmentForm({ onClose, timeSlot, calendarRef }) {
  // Variables for handling appointment data
  const appointmentRef = React.useRef(null);
  const [addApp, { data: res, isLoading, isError, isSuccess }] =
    useAddAppMutation();
  // Variables for handling pacient data
  const patientRef = React.useRef(null);
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
   * Hook for handling result of adding new appointment
   */
  React.useEffect(() => {
    if (isSuccess) {
      if (
        res.entry.filter((entry) => entry.response.location.includes("Patient"))
          .length > 0
      ) {
        patientRef.current.refetchPatients();
      }
      onClose();
    } else if (isError) {
      setAlertMsg("Návštěvu se nepodařilo uložit");
      toogleAlert();
    }
  }, [isSuccess, isError]);
  /**
   * Function for checking if form contains all required data
   * @param {Object} data Object with data about appointment
   * @returns {boolean} True if form is valid, false otherwise
   */
  const isFormValid = (data) => {
    if (
      data.startDate === null ||
      data.room.id === "" ||
      data.duration === 0 ||
      !data.duration
    ) {
      setAlertMsg("Je nutné vyplnit datum, místnost a dobu trvání");
      toogleAlert();
      return false;
    } else return true;
  };
  /**
   * Function for checking if patient exists and if should be created
   * @param {Object} patient Object with patient data
   * @returns {boolean} True if patient exists, false otherwise
   */
  const patientExists = (patient) => {
    return !(!patient.id && patient.owner !== "");
  };
  /**
   * Function for creatinf bundle entry with patient resource
   * @param {Object} patient Object with patient data
   * @returns {Object} Bundle entry for patient
   */
  const createPatientBundleEntry = (patient) => {
    const patientResource = createFhirResource({
      ...patient,
      resourceType: "Patient",
    });
    patient.id = `urn:uuid:${uuidv4()}`;
    const url = `/Patient?name=${encodeURI(patient.name)}&birthdate=${
      patient.birthDate
    }`;
    return createBundleEntry({
      resource: patientResource,
      method: "PUT",
      fullUrl: patient.id,
      url: url,
    });
  };
  /**
   * Function for creating bundle entry with appointment resource
   * @param {Object} appData Object with appointment data
   * @param {Object} patient Object with patient data
   */
  const createAppointmenBundleEntry = (appData, patient) => {
    const appointment = createFhirResource({
      resourceType: "Appointment",
      ...appData,
      room: { ...appData.room, type: "Location" },
      doctor: { ...appData.doctor, type: "Practitioner" },
      patient: { ...patient, type: "Patient" },
    });
    return createBundleEntry({
      resource: appointment,
      method: "POST",
      fullUrl: `urn:uuid:${uuidv4()}`,
      url: "/Appointment",
    });
  };
  /**
   * Function for creating bundle with appointment and patient resources
   * @param {Object} appData Object with appointment data
   * @param {Object} patient Object with patient data
   * @returns {Object} Bundle with appointment and patient resources
   */
  const createAppBundle = (appData, patient) => {
    const bundleEntries = [];
    if (!patientExists(patient)) {
      bundleEntries.push(createPatientBundleEntry(patient));
    }
    bundleEntries.push(createAppointmenBundleEntry(appData, patient));
    return createBundle(bundleEntries);
  };
  /**
   * Function for handling submit of appointment form
   */
  const onAppSubmit = () => {
    const appData = appointmentRef.current.getAppData();
    const patient = patientRef.current.getPatientData();
    if (!isFormValid(appData)) return;
    const bundle = createAppBundle(appData, patient);
    addApp(bundle);
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
    </>
  );
}
