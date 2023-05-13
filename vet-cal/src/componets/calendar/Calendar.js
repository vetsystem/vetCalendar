import * as React from "react";

import { useGetRoomsQuery } from "../../features/rooms/roomsSlice";
import { useGetDoctorsQuery } from "../../features/doctors/doctorsSlice";

import CalToolbar from "./CalToolbar";
import SchedulerView from "./SchedulerView";
import { useGetShiftsQuery } from "../../features/shifts/shiftSlice";
import { useGetAppointmentsQuery } from "../../features/appointments/appointmentsSlice";
import { formatISO } from "date-fns";
import { useGetPatientsQuery } from "../../features/patients/patientsSlice";

export default function Calendar() {
  const { isLoading: doctorDataLoading } = useGetDoctorsQuery();
  const { isLoading: roomDataLoading } = useGetRoomsQuery();
  const { isLoading: shiftDataLoading } = useGetShiftsQuery();
  const { isLoading: appDataLoading } = useGetAppointmentsQuery();
  const { isLoading: patinetDataLoading } = useGetPatientsQuery();

  const addIconRef = React.useRef(null);
  const schedulerRef = React.useRef(null);

  return (
    <>
      <CalToolbar
        schedulerRef={schedulerRef}
        isDataLoading={
          doctorDataLoading ||
          roomDataLoading ||
          shiftDataLoading ||
          appDataLoading
        }
        addIconRef={addIconRef}
      />
      {doctorDataLoading ||
      roomDataLoading ||
      shiftDataLoading ||
      appDataLoading ? null : (
        <SchedulerView addIconRef={addIconRef} schedulerRef={schedulerRef} />
      )}
    </>
  );
}
