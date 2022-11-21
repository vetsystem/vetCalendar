import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DateTimeInput from "./DateTimeInput";
import DurationInput from "./DurationInput";
import addDays from "date-fns/addDays";
import AppReasonInput from "./AppReasonInput";
import DoctorInput from "./DoctorInput";
import RoomInput from "./RoomInput";

export default function AppDetailForm() {
  const [appDateTime, setAppDateTime] = React.useState(null);
  return (
    <Stack spacing={1}>
      <AppReasonInput />
      <Stack direction="row" spacing={1}>
        <DateTimeInput
          appDate={appDateTime}
          onChange={(newDateTime) => {
            setAppDateTime(newDateTime);
          }}
        />
        <DurationInput />
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="space-evenly">
        <Button
          variant="text"
          onClick={() => {
            setAppDateTime(addDays(new Date(), 1));
          }}
        >
          Zítra
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setAppDateTime(addDays(new Date(), 3));
          }}
        >
          Za 3 dny
        </Button>
        <Button
          variant="text"
          onClick={() => {
            setAppDateTime(addDays(new Date(), 7));
          }}
        >
          Za týden
        </Button>
      </Stack>
      <DoctorInput />
      <RoomInput />
    </Stack>
  );
}
