import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Scheduler } from "react-scheduler";

import AddAppointmentForm from "./newApp/AddAppointmentForm";

import {
  differenceInMinutes,
  formatISO,
  getHours,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { cs } from "date-fns/locale";

import { DrawerWidth } from "../SideMenu";
import { LightenDarkenColor, nameToColor } from "../../utils/nameToColor";

import { selectAllRooms } from "../../features/rooms/roomsSlice";
import { selectPatientsEnts } from "../../features/patients/patientsSlice";
import {
  getShiftsForDay,
  selectAllShifts,
  useGetShiftsForDayQuery,
} from "../../features/shifts/shiftSlice";
import { selectDocsEnts } from "../../features/doctors/doctorsSlice";
import {
  selectAllApps,
  useDeleteAppMutation,
} from "../../features/appointments/appointmentsSlice";
import { speciesOptions } from "../../utils/globals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createFhirResource } from "../../utils/fhir/fhirUtil";

const SchedulerView = ({ schedulerRef, addIconRef }) => {
  const { height: windowHeight } = useSelector((state) => state.window);
  const scrollingRef = React.useRef(null);
  const selectedDate = parseISO(
    useSelector((state) => state.calendar.selectedDate)
  );

  const apps = useSelector(selectAllApps);
  const { data: shifts, isLoading: isShifsLoading } = useGetShiftsForDayQuery(
    formatISO(selectedDate, { representation: "date" })
  );
  const doctors = useSelector(selectDocsEnts);
  const rooms = useSelector(selectAllRooms);
  const patients = useSelector(selectPatientsEnts);

  const [deleteApp, { isLoading: isDeleting }] = useDeleteAppMutation();

  React.useEffect(() => {
    const eventsArr = apps.map((app) => {
      const event = {
        event_id: app.event_id,
        start: new Date(app.start),
        end: new Date(app.end),
        title: app.title,
        assignee: app.assignee,
        editable: false,
      };
      if (app.doctorId) {
        event.doctor = doctors[app.doctorId];
        event.color = nameToColor(doctors[app.doctorId].name);
      }
      if (app.patientId) {
        event.patient = patients[app.patientId];
      }
      return event;
    });
    schedulerRef.current?.scheduler?.handleState(eventsArr, "events");
  }, [apps, schedulerRef, doctors, patients]);

  React.useEffect(() => {
    if (scrollingRef.current !== null && schedulerRef.current !== null) {
      const containerHeight = schedulerRef.current.el.offsetHeight;
      const hourSlotHeight =
        containerHeight /
        (process.env.REACT_APP_WORKING_HOURS_END -
          process.env.REACT_APP_WORKING_HOURS_START);
      const h = getHours(new Date());
      const position = h * hourSlotHeight;
      scrollingRef.current.scrollTo(0, position);
    }
  });

  const getSelectedShift = ({ start, end, assignee }) => {
    const timeslotData = {
      start: start,
      end: end,
      duration: start && end ? differenceInMinutes(end, start) : 0,
      room: assignee || "",
      doctor: "",
      shiftId: "",
    };
    if (!timeslotData.start || isShifsLoading) return timeslotData;
    const shiftsArr = Object.values(shifts.entities);
    const selectedShift = shiftsArr.filter(
      (shift) =>
        shift.room[0].reference === timeslotData.room &&
        isWithinInterval(timeslotData.start, {
          start: parseISO(shift.start),
          end: parseISO(shift.end),
        }) &&
        isWithinInterval(timeslotData.end, {
          start: parseISO(shift.start),
          end: parseISO(shift.end),
        })
    );

    if (selectedShift.length === 0) return timeslotData;
    timeslotData.doctor = {
      id: selectedShift[0].doctor[0]?.reference,
      name: doctors[selectedShift[0].doctor[0].reference].name,
      initials: selectedShift[0].doctor[0]?.display,
      color: nameToColor(doctors[selectedShift[0].doctor[0].reference].name),
    };
    timeslotData.shiftId = selectedShift[0].id;

    return timeslotData;
  };

  const handleDelete = (prop) => {
    deleteApp(prop);
  };

  const emptyResourceHeader = () => <div style={{ display: "none" }} />;

  const eventRendererFn = (props) => {
    let color = "primary.main";
    let lighterColor = "secondary.main";
    let textColor = "black";
    if (props.event.doctor) {
      color = nameToColor(props.event.doctor.name);
      lighterColor = LightenDarkenColor(color, 40);
      textColor = "white";
    }

    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: lighterColor,
          borderLeft: 6,
          borderColor: color,
        }}
      >
        <Button
          onClick={props.onClick}
          color="inherit"
          sx={{
            "&:hover": {
              backgroundColor: color,
            },
          }}
        >
          {props.event.patient ? (
            <>
              <FontAwesomeIcon
                style={{ color: "black" }}
                icon={speciesOptions[props.event.patient.species.code].icon}
              />
              <Typography variant="hEventTitle1" sx={{ ml: 1 }}>
                {props.event.patient.owner.split(" ")[0]}{" "}
              </Typography>
              <Typography variant="hEventTitle2">
                {props.event.patient.name} - {props.event.title}
              </Typography>
            </>
          ) : (
            <Typography variant="hEventTitle2" color={textColor}>
              {props.event.title}
            </Typography>
          )}
        </Button>
      </Box>
    );
  };

  const cellRendererFn = (props) => {
    let initials = "";
    let color = "primary";
    const shift = getSelectedShift({
      start: props.start,
      end: props.end,
      assignee: props.assignee,
    });
    if (shift.doctor !== "") {
      initials = shift.doctor.initials;
      color = shift.doctor.color;
    }
    return (
      <Button
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "0",
          cursor: "pointer",
        }}
        {...props}
      >
        <Typography
          style={{
            color: color,
            opacity: "0.4",
            fontSize: 40,
            fontWeight: "bolder",
            letterSpacing: 8,
          }}
        >
          {initials}
        </Typography>
      </Button>
    );
  };
  const headRendererFn = (props) => null;

  const customEditorRenderer = (selectedState) => {
    const selectedShift = getSelectedShift({
      start: selectedState.state.start.value,
      end: selectedState.state.end.value,
      assignee: selectedState.assignee,
    });
    const selectedTimeSlot = {
      start: selectedShift.start,
      end: selectedShift.end,
      duration: selectedShift.duration,
      room: selectedShift.room || "",
      doctor: selectedShift.doctor?.id || "",
      shiftId: selectedShift.shiftId || "",
    };

    return (
      <AddAppointmentForm
        timeSlot={selectedTimeSlot}
        onClose={selectedState.close}
        calendarRef={schedulerRef}
      />
    );
  };

  return (
    <>
      {/* Room header */}
      <Stack
        direction="row"
        position="fixed"
        sx={{
          width: `calc(100% - ${DrawerWidth}px)`,
          ml: `${DrawerWidth}px`,
          mt: 8,
          zIndex: "1000",
          height: "40px",
          justifyContent: "space-around",
          px: 3,
          pt: 1,
        }}
      >
        {rooms.map((room) => {
          return (
            <Box key={`wrap_${room.id}`} sx={{ bgcolor: "background.paper" }}>
              <Typography
                key={room.id}
                variant="hResource"
                style={{ opacity: "0.6" }}
                sx={{ px: 4 }}
              >
                {room.name}
              </Typography>
            </Box>
          );
        })}
      </Stack>
      {/* Calendar */}

      <Box
        ref={scrollingRef}
        style={{ height: windowHeight - 68, overflow: "auto" }}
        sx={{ mt: 8, p: 1, width: "100%" }}
      >
        <Scheduler
          ref={schedulerRef}
          locale={cs}
          selectedDate={selectedDate}
          disableViewNavigator={true}
          navigation={false}
          view="day"
          day={{
            startHour: process.env.REACT_APP_WORKING_HOURS_START,
            endHour: process.env.REACT_APP_WORKING_HOURS_END,
            step: process.env.REACT_APP_MIN_SLOT_DURATION,
            cellRenderer: cellRendererFn,
            headRenderer: headRendererFn,
          }}
          month={null}
          week={null}
          recourseHeaderComponent={emptyResourceHeader}
          customEditor={customEditorRenderer}
          hourFormat="24"
          resources={rooms}
          resourceFields={{ admin_id: "id", textField: "name" }}
          editorAnchor={addIconRef}
          popperProps={{
            style: {
              maxHeight: windowHeight - 64,
              overflow: "auto",
              zIndex: "1000",
            },
          }}
          onDelete={handleDelete}
          eventRenderer={eventRendererFn}
          viewerTitleComponent={(event) => {
            return (
              <>
                {event.patient ? (
                  <>
                    <Typography variant="hResource" sx={{ mr: 1 }}>
                      {event.patient.owner}
                    </Typography>
                    <FontAwesomeIcon
                      size="lg"
                      icon={speciesOptions[event.patient.species.code].icon}
                    />
                    <Typography sx={{ ml: 1 }} display="inline">
                      {event.patient.name}
                    </Typography>
                    <Typography>{event.title}</Typography>
                  </>
                ) : (
                  <Typography>{event.title}</Typography>
                )}
              </>
            );
          }}
        />
      </Box>
    </>
  );
};

export default SchedulerView;
