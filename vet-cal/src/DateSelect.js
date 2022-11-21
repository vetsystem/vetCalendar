import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowLeftRight from "@mui/icons-material/ArrowRight";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Stack } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, addDays, subDays } from "date-fns";
import cs from "date-fns/locale/cs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box } from "@mui/material";

function DateSelect() {
  const [date, setDate] = React.useState(new Date());

  const [openPicker, setPicker] = React.useState(false);

  React.useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
  }, [date]);

  const tomorrow = () => {
    setDate(addDays(date, 1));
  };

  const yesterday = () => {
    setDate(subDays(date, 1));
  };
  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={yesterday} color="inherit">
        <ArrowLeftIcon fontSize="large" />
      </IconButton>
      <Typography variant="hDate" align="center" sx={{ width: 170 }}>
        {format(date, "eeeeee d. MMMM", { locale: cs })}
      </Typography>
      <IconButton onClick={tomorrow} color="inherit">
        <ArrowLeftRight fontSize="large" />
      </IconButton>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={cs}>
        <DatePicker
          mask="__.__.____"
          open={openPicker}
          onOpen={() => setPicker(true)}
          onClose={() => setPicker(false)}
          label="Custom input"
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
          }}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                ref={inputRef}
                onClick={(e) => setPicker(true)}
                color="inherit"
              >
                <DateRangeIcon fontSize="large" />
              </IconButton>
              {/*<input ref={inputRef} {...inputProps} />*/}
            </Box>
          )}
        />
      </LocalizationProvider>
    </Stack>
  );
}

export default DateSelect;
