import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";

export default function DateTimeInput(props) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={cs}>
        <DateTimePicker
          renderInput={(props) => (
            <TextField
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: 150 }}
              {...props}
            />
          )}
          label="Datum a čas"
          value={props.appDate}
          onChange={props.onChange}
          disablePast={true}
          showDaysOutsideCurrentMonth={true}
          inputFormat="dd.MM. HH:mm"
          mask="__.__. __:__"
          showToolbar={true}
        />
      </LocalizationProvider>
    </>
  );
}
