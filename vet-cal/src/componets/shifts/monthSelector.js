import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowLeftRight from "@mui/icons-material/ArrowRight";
import Typography from "@mui/material/Typography";

import cs from "date-fns/locale/cs";
import { addMonths, format } from "date-fns";
/**
 * Component with toolbar for selecting month. It display selected month and
 * has two buttons for selecting next month and previous month
 * @param {{selectedMonth: Date, changeMonth: Function}} props - selectedMonth
 * is month showed on toolbar, changeMonth is function for changing selected
 * month
 * @returns {React.ElementType}
 */
export default function MonthSelector({ selectedMonth, changeMonth }) {
  /**
   * Update month selector to next month
   */
  const nextMonth = () => {
    const month = addMonths(selectedMonth, 1);
    changeMonth(month);
  };
  /**
   * Update month selector to previous month
   */
  const previousMonth = () => {
    const month = addMonths(selectedMonth, -1);
    changeMonth(month);
  };

  return (
    <>
      <Stack direction="row" alignItems="center">
        <IconButton onClick={previousMonth}>
          <ArrowLeftIcon fontSize="large" />
        </IconButton>
        <Typography variant="hDate" align="center" sx={{ width: 160 }}>
          {format(selectedMonth, "LLLL y", { locale: cs })}
        </Typography>
        <IconButton onClick={nextMonth}>
          <ArrowLeftRight fontSize="large" />
        </IconButton>
      </Stack>
    </>
  );
}
