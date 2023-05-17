import * as React from "react";
import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import cs from "date-fns/locale/cs";
import addMinutes from "date-fns/addMinutes";
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";

import { v4 as uuidv4 } from "uuid";

import DoctorInput from "../doctors/DoctorInput";
import RoomInput from "../rooms/RoomInput";
import { createBundle, createBundleEntry } from "../../utils/fhir/fhirUtil";

import { useAddShiftMutation } from "./shiftSlice";

import scheduleRes from "../../utils/fhir/scheduleRes";
import slotRes from "../../utils/fhir/slotRes";
import { subMinutes } from "date-fns";

// Initial value of new shift object
const initValue = {
  actors: {
    doctor: "",
    room: "",
  },
  start: null,
  end: null,
  repeat: false,
  dayInterval: 0,
  // endRepDay: defEndRepDay,
};

export default function AddShiftForm({ open, anchorEl, onClose }) {
  // Height of the viewport for preventing overflow of the form
  const { height } = useSelector((state) => state.window);
  // Mutation with trigger function and result for adding shift to FHIR server
  const [addShift, result] = useAddShiftMutation();
  // Setting React state for shift object
  const [shift, setShift] = React.useState(initValue);
  // Popper for warning messages
  const [openAlert, toggleOpenAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  /**
   * Function for handling opening and closing of warning messages popper
   */
  const handleOpenAlert = () => {
    toggleOpenAlert(!openAlert);
  };
  /**
   * Function for reseting shift form variables
   */
  const resetShift = () => setShift(initValue);
  /**
   * Function for closing form after succesfull submiting
   */
  const handleClose = () => {
    resetShift();
    onClose();
  };
  /**
   * Function for updating actors in shift state
   * @param {Object} newValue Object with new value for actors (room or doctor)
   * difference between doctor and room is only in display attribute
   */
  const updateActorsState = (newValue) => {
    const display = newValue.initials ?? newValue.name;
    setShift({
      ...shift,
      actors: {
        ...shift.actors,
        [newValue.type]: {
          type: newValue.resourceType,
          id: newValue.id,
          display: display,
          name: newValue.name,
        },
      },
    });
  };
  /**
   * Function for setting doctor in shift state. Handling even null value from
   * onChange event (updateActorsState can't do that)
   * @param {Event} event not used param
   * @param {Object} newValue Object with new value for doctor
   * {id: "1", name: "MUDr. Jan Novák", initials: "JN", type: "Practitioner"}
   */
  const setDoctor = (event, newValue) => {
    if (newValue === null) {
      setShift({ ...shift, actors: { ...shift.actors, doctor: "" } });
    } else {
      updateActorsState(newValue);
    }
  };
  /**
   * Function for setting room in shift state. Handling even null value from
   * onChange event (updateActorsState can't do that)
   * @param {Event} event not used param
   * @param {Object} newValue Object with new value for room
   * {id: "1", name: "Ordinace 1", type: "Location"}
   */
  const setRoom = (event, newValue) => {
    if (newValue === null) {
      setShift({ ...shift, actors: { ...shift.actors, room: "" } });
    } else {
      updateActorsState(newValue);
    }
  };
  /**
   * Function returning function for setting date and time in shift state
   * @param {String} dateTimeType distinguish between start and end date
   * @returns function for setting date and time in shift state
   */
  const setDateTime = (dateTimeType) => {
    return (newValue) => {
      setShift({ ...shift, [dateTimeType]: newValue });
    };
  };
  /**
   * Function to generate bundle for creating schedule with it's slots. It check
   * if the room in the specified time is free for scheduling shift.
   * @param {Object} room Room object
   * {id: "1", display: "Ordinace 1", name: "Ordinace 1", type: "Location"}
   * @param {Object} doctor Doctor object
   * {id: "1", display: JN, name: "MUDr. Jan Novák", type: "Practitioner"}
   * @param {Object} shiftTime Object with start and end date time of the shift
   * {start: Date, end: Date}
   * @returns Object bundle with schedule and it's slots entries
   */
  const createAddScheduleBundle = (room, doctor, shiftTime) => {
    const scheduleEntry = createScheduleEntry(room, doctor, shiftTime);
    const slotsEntries = createSlotsEntries(scheduleEntry.fullUrl, shiftTime);
    return createBundle([scheduleEntry, ...slotsEntries]);
  };
  /**
   * Function to generate schedule entry for creating bundle
   * @param {Object} room Room object
   * {id: "1", display: "Ordinace 1", name: "Ordinace 1", type: "Location"}
   * @param {Object} doctor Doctor object
   * {id: "1", display: JN, name: "MUDr. Jan Novák", type: "Practitioner"}
   * @param {Object} shiftTime Object with start and end date time of the shift
   * {start: Date, end: Date}
   * @returns Object with schedule entry
   */
  const createScheduleEntry = (room, doctor, shiftTime) => {
    const scheduleId = `urn:uuid:${uuidv4()}`;
    return createBundleEntry({
      fullUrl: scheduleId,
      resource: scheduleRes({
        actors: [room, doctor],
        start: shiftTime.start,
        end: shiftTime.end,
      }),
      method: "POST",
      url: "/Schedule",
    });
  };
  /**
   * Function for creating relative url for checking if the room is free for
   * scheduling shift. This search url is use in bundle for conditional creating
   * schedule resource and it's slots
   * @param {String} roomId identifier of the room "Location/1"
   * @param {Object} shiftTime Object with start and end date time of the shift
   * {start: Date, end: Date}
   * @returns String with relative url for checking if the room is free for
   * scheduling shift
   */
  const createSearchScheduleUrl = () => {
    const roomId = shift.actors.room.id;
    const start = addMinutes(shift.start, 1);
    const end = subMinutes(shift.end, 1);
    const searchParams = new URLSearchParams([
      ["actor", roomId],
      ["date", `ge${format(start, "yyyy-MM-dd'T'HH:mm:ssXXX")}`],
      ["date", `le${format(end, "yyyy-MM-dd'T'HH:mm:ssXXX")}`],
      ["_total", "accurate"],
    ]);
    return `/Schedule?${searchParams.toString()}`;
  };
  /**
   * Function for creating slots entries for creating bundle. Slots are
   * connected to it's schedule by scheduleId
   * @param {String} scheduleId urn:uuid identifier of the schedule
   * "urn:uuid:6117ee96-c652-4faa-8eff-6831980cc2b3" fhir server use it for
   * connecting slots to theirs schedule andsubstitute it with it's own identifier
   * @param {Object} shiftTime Object with start and end date time of the shift
   * {start: Date, end: Date}
   * @returns Array of slots entries
   */
  const createSlotsEntries = (scheduleId, shiftTime) => {
    const slotIntervals = generateSlotsIntervals(
      shiftTime.start,
      shiftTime.end
    );
    return slotIntervals.map((interval) => {
      return createBundleEntry({
        fullUrl: `urn:uuid:${uuidv4()}`,
        resource: slotRes(
          scheduleId,
          interval.intervalStart,
          interval.intervalEnd
        ),
        method: "POST",
        url: "/Slot",
      });
    });
  };
  /**
   * Function for generating time intervals for slots. Number of intervals are
   * based on planning horizont of the schdule and duration of the interval is
   * base no enviromental variable for min slot duration
   * @param {Date} start Start of the shift
   * @param {Date} end End of the shift
   * @returns Array of objects with start and end date time of the slots
   * {intervalStart: Date, intervalEnd: Date}
   */
  const generateSlotsIntervals = (start, end) => {
    const slotsIntervals = [];
    let intervalStart = start;
    let intervalEnd = new Date();
    while (isBefore(intervalEnd, end)) {
      intervalEnd = addMinutes(
        intervalStart,
        process.env.REACT_APP_MIN_SLOT_DURATION
      );
      slotsIntervals.push({ intervalStart, intervalEnd });
      intervalStart = intervalEnd;
    }
    return slotsIntervals;
  };
  /**
   * Function for validating form inputs
   * @returns boolean true if all form inputs are valid
   */
  const isFormInputValid = () => {
    if (
      shift.actors.doctor === "" ||
      shift.actors.room === "" ||
      shift.start === null ||
      shift.end === null
    ) {
      setAlertMessage("Vyplňte všechny údaje!");
      return false;
    } else if (isBefore(shift.start, new Date())) {
      setAlertMessage("Začátek směny musí být v budoucnosti!");
      return false;
    } else if (isBefore(shift.end, shift.start)) {
      setAlertMessage("Začátek směny musí předcházet konci!");
      return false;
    }
    return true;
  };
  /**
   * Functin for creating schedule and it's resources and check if time and
   * room for schedule is free
   * @param {Object} bundle FHIR transaction bundle
   */
  const postShift = (bundle) => {
    addShift({
      searchUrl: createSearchScheduleUrl(),
      bundle: bundle,
    })
      .unwrap()
      .then((data) => resetShift())
      .catch((error) => {
        setAlertMessage(error);
        handleOpenAlert();
      });
  };
  /**
   * Function for submiting shift to FHIR server
   */
  const onSubmit = () => {
    // Validate form
    if (!isFormInputValid()) {
      handleOpenAlert();
      return;
    }
    // Create bundle with schedule and slots resources
    const bundle = createAddScheduleBundle(
      shift.actors.room,
      shift.actors.doctor,
      { start: shift.start, end: shift.end }
    );
    // Post bundle to FHIR server
    postShift(bundle);
  };

  return (
    <Popper
      style={{ maxHeight: height - 64, overflow: "auto" }}
      open={open}
      anchorEl={anchorEl}
      placement={"bottom"}
    >
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleOpenAlert}
      >
        <Alert
          severity="error"
          variant="filled"
          action={
            <IconButton size="small" onClick={handleOpenAlert}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Stack
        spacing={1}
        sx={{
          width: 312,
          p: 2,
          bgcolor: "secondary.main",
        }}
      >
        <DoctorInput
          selectedDoctorId={shift.actors.doctor.id}
          onChangeFn={setDoctor}
          disabled={result.isLoading}
        />
        <RoomInput
          selectedRoomId={shift.actors.room.id}
          onChangeFn={setRoom}
          disabled={result.isLoading}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
          <DateTimePicker
            label="Začátek směny"
            disabled={result.isLoading}
            disablePast
            value={shift.start}
            onChange={setDateTime("start")}
            slotProps={{ textField: { variant: "standard" } }}
          ></DateTimePicker>
          <DateTimePicker
            label="Konec směny"
            disabled={result.isLoading}
            dispablePast
            value={shift.end}
            onChange={setDateTime("end")}
            slotProps={{ textField: { variant: "standard" } }}
          ></DateTimePicker>
        </LocalizationProvider>
        <Stack direction="row" justifyContent="end" spacing={1}>
          <Button onClick={handleClose} disabled={result.isLoading}>
            Zavřít
          </Button>
          <LoadingButton
            variant="contained"
            onClick={onSubmit}
            loadingPosition="start"
            loading={result.isLoading}
            startIcon={<SaveIcon />}
          >
            Uložit
          </LoadingButton>
        </Stack>
      </Stack>
    </Popper>
  );
}
