import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DateTimeInput(props) {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
        <DateTimePicker
          slotProps={{
            textField: {
              variant: "standard",
              sx: { width: "144px" },
              InputLabelProps: { shrink: true },
            },
            inputAdornment: { sx: { ml: 0 } },
          }}
          label="Datum a čas"
          value={props.appDate}
          onChange={props.onChange}
          disablePast={true}
          showDaysOutsideCurrentMonth={true}
          format="dd.MM. HH:mm"
          showToolbar={true}
        />
      </LocalizationProvider>
    </>
  );
}
