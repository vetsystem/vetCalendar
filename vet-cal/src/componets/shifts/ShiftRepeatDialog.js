import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import cs from "date-fns/locale/cs";

export default function ShiftRepeatDialog({
  open,
  handleClose,
  changeEndDate,
  defVal,
}) {
  const [endDate, setEndDate] = React.useState(defVal);

  const handleCloseDialog = () => {
    handleClose(false);
    setEndDate(defVal);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    changeEndDate(endDate);
    handleClose(false);
    setEndDate(defVal);
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Nastavení opakování směny</DialogTitle>
      <DialogContent>
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
            <DatePicker
              label="Konec opakování"
              value={endDate}
              onChange={(newVal) => {
                setEndDate(newVal);
              }}
              slotProps={{ textField: { variant: "standard" } }}
              format="dd.MM.yyyy"
            ></DatePicker>
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Zavřít</Button>
        <Button onClick={handleSubmit}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
