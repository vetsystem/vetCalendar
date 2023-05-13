import * as React from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowLeftRight from "@mui/icons-material/ArrowRight";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, addDays, subDays, formatISO, parseISO } from "date-fns";
import cs from "date-fns/locale/cs";
import { changeSelectedDate } from "../../features/calendar/calendarSlice";
import { useDispatch, useSelector } from "react-redux";

/**
 * Component for displaying date picker button
 * @param {{setOpen, InputProps}} props
 * @returns React.ElementType
 */
function ButtonField(props) {
  const { setOpen, InputProps: { ref } = {} } = props;

  return (
    <IconButton
      ref={ref}
      onClick={() => setOpen?.((prev) => !prev)}
      color="inherit"
    >
      <DateRangeIcon fontSize="large" />
    </IconButton>
  );
}

/**
 * Component for displaying date picker with button
 * @param {} props
 * @returns React.ElementType
 */
function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

/**
 * Component with toolbar for selecting date. It display selected date and has
 * three buttons for selecting next date, previous date and open date picker
 * @param {{schedulerRef: Reference}} props - schedulerRef is a
 * reference to scheduler for manipulating it's date
 * @returns {React.ElementType}
 */
function DateSelect({ schedulerRef }) {
  const dispatch = useDispatch();
  const selectedDate = parseISO(
    useSelector((state) => state.calendar.selectedDate)
  );

  /**
   * Update current date in date selector and scheduler
   * @param {date} newDate - new current date
   */
  const updateDate = (newDate) => {
    schedulerRef.current.scheduler.handleGotoDay(newDate);
    dispatch(
      changeSelectedDate(formatISO(newDate, { representation: "date" }))
    );
  };

  /**
   * Update date selector and scheduler to next date
   */
  const nextDate = () => {
    const nextDate = addDays(selectedDate, 1);
    updateDate(nextDate);
  };

  /**
   * Update date selector and scheduler to previous date
   */
  const prevDate = () => {
    const prevDate = subDays(selectedDate, 1);
    updateDate(prevDate);
  };

  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={prevDate} color="inherit">
        <ArrowLeftIcon fontSize="large" />
      </IconButton>
      <Typography variant="hDate" align="center" sx={{ width: 170 }}>
        {format(selectedDate, "eeeeee d. MMMM", { locale: cs })}
      </Typography>
      <IconButton onClick={nextDate} color="inherit">
        <ArrowLeftRight fontSize="large" />
      </IconButton>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
        <ButtonDatePicker
          value={selectedDate}
          onChange={(newVal) => updateDate(newVal)}
        />
      </LocalizationProvider>
    </Stack>
  );
}

export default DateSelect;
