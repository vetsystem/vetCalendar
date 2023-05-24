import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import addDays from "date-fns/addDays";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DateTimeInput from "../../inputs/DateTimeInput";
import DurationInput from "../../inputs/DurationInput";

import AppReasonInput from "../../../features/appReasons/AppReasonInput";
import DoctorInput from "../../../features/doctors/DoctorInput";
import RoomInput from "../../../features/rooms/RoomInput";

import {
  addMinutes,
  formatISO,
  isValid,
  roundToNearestMinutes,
} from "date-fns";
import createDurationLabel from "../../../utils/createDurationLabel";
import { useGetRoomsQuery } from "../../../features/rooms/roomsSlice";
import { useGetDoctorsQuery } from "../../../features/doctors/doctorsSlice";
import { changeSelectedDate } from "../../../features/calendar/calendarSlice";

const AppDetailForm = forwardRef(({ calendarRef, selectedSlot }, ref) => {
  const user = useSelector((state) => state.user);
  const { data: doctorData } = useGetDoctorsQuery();
  const doctors = doctorData.entities;
  const { data: roomData } = useGetRoomsQuery();
  const rooms = roomData.entities;

  const dispatch = useDispatch();

  const initialState = {
    appReason: "",
    startDate: null,
    duration: 0,
    endDate: null,
    room: { id: "", type: "room", name: "" },
    roomSelection: [],
    doctor: {
      id: user.id,
      type: "doctor",
      name: user.name,
    },
    doctorSelection: [],
  };

  const [state, setState] = useState(initialState);

  useImperativeHandle(ref, () => {
    return {
      getAppData() {
        return state;
      },
    };
  });

  useEffect(() => {
    if (selectedSlot.start) {
      setState((prev) => ({
        ...prev,
        startDate: selectedSlot.start,
        duration: prev.duration !== 0 ? prev.duration : selectedSlot.duration,
        endDate:
          prev.duration !== 0
            ? addMinutes(selectedSlot.start, prev.duration)
            : selectedSlot.end,
        room: rooms[selectedSlot.room] || { id: "", type: "room", name: "" },
        doctor: doctors[selectedSlot.doctor] || {
          id: "",
          type: "doctor",
          name: "",
        },
      }));
    }
  }, [
    selectedSlot.start,
    selectedSlot.duration,
    selectedSlot.end,
    selectedSlot.room,
    selectedSlot.doctor,
    doctors,
    rooms,
  ]);

  function onChangeFn(type) {
    const fn = (event, newValue) => {
      if (newValue === null) newValue = { id: "", type: type, name: "" };
      setState((prevState) => ({ ...prevState, [type]: newValue }));
    };
    return fn;
  }

  const onChangeDuration = (event, newValue) => {
    const minutes = newValue?.duration ?? 0;
    setState((prevState) => ({ ...prevState, duration: minutes }));
    if (state.startDate || state.startDate !== "") {
      setState((prevState) => ({
        ...prevState,
        endDate: addMinutes(state.startDate, minutes),
      }));
    }
  };

  const onStartChange = (newDateTime) => {
    if (isValid(newDateTime)) {
      setState((prevState) => ({ ...prevState, startDate: newDateTime }));
      if (state.duration !== 0) {
        setState((prevState) => ({
          ...prevState,
          endDate: addMinutes(newDateTime, state.duration),
        }));
      }
      dispatch(
        changeSelectedDate(formatISO(newDateTime, { representation: "date" }))
      );
      calendarRef.current.scheduler.handleGotoDay(newDateTime);
    } else {
      setState((prevState) => ({ ...prevState, startDate: null }));
    }
  };
  return (
    <Stack spacing={1}>
      <AppReasonInput onChange={setState} />
      <Stack direction="row" spacing={1}>
        <DateTimeInput appDate={state.startDate} onChange={onStartChange} />
        <DurationInput
          value={{
            duration: state.duration,
            label: createDurationLabel(state.duration),
          }}
          onChangeFn={onChangeDuration}
        />
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="space-evenly">
        <Button
          variant="text"
          onClick={() => {
            const newDate = roundToNearestMinutes(addDays(new Date(), 1), {
              nearestTo: 30,
            });
            onStartChange(newDate);
          }}
        >
          Zítra
        </Button>
        <Button
          variant="text"
          onClick={() => {
            const newDate = roundToNearestMinutes(addDays(new Date(), 3), {
              nearestTo: 30,
            });
            onStartChange(newDate);
          }}
        >
          Za 3 dny
        </Button>
        <Button
          variant="text"
          onClick={() => {
            const newDate = roundToNearestMinutes(addDays(new Date(), 7), {
              nearestTo: 30,
            });
            onStartChange(newDate);
          }}
        >
          Za týden
        </Button>
      </Stack>
      <DoctorInput
        onChangeFn={onChangeFn("doctor")}
        selection={state.doctorSelection}
        selectedDoctorId={state.doctor.id}
      />
      <RoomInput
        onChangeFn={onChangeFn("room")}
        selection={state.roomSelection}
        selectedRoomId={state.room.id}
      />
    </Stack>
  );
});

export default AppDetailForm;
