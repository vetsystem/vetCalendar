import React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import AnimalSelector from "./AnimalSelector";

export default function PatientDatailForm() {
  const [birthDate, setBirthDate] = React.useState(null);
  const ageOptions = [
    { label: "1 měsíc" },
    { label: "2 měsíce" },
    { label: "3 měsíce" },
    { label: "4 měsíce" },
    { label: "5 měsíců" },
    { label: "6 měsíců" },
    { label: "7 měsíců" },
    { label: "8 měsíců" },
    { label: "9 měsíců" },
    { label: "10 měsíců" },
    { label: "11 měsíců" },
    { label: "1 rok" },
    { label: "2 roky" },
    { label: "3 roky" },
    { label: "4 roky" },
    { label: "5 let" },
    { label: "6 let" },
    { label: "7 let" },
    { label: "8 let" },
    { label: "9 let" },
    { label: "10 let" },
    { label: "11 let" },
    { label: "12 let" },
    { label: "13 let" },
    { label: "14 let" },
    { label: "15 let" },
    { label: "16 let" },
    { label: "17 let" },
    { label: "18 let" },
    { label: "19 let" },
    { label: "20 let" },
  ];

  return (
    <Stack spacing={1}>
      <TextField variant="standard" label="Jméno klieta/majitele" />
      <TextField variant="standard" label="Kontakt" />
      <TextField variant="standard" label="Jméno pacienta" />
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={cs}>
          <DatePicker
            renderInput={(props) => (
              <TextField
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                {...props}
              />
            )}
            label="Datum narození"
            value={birthDate}
            onChange={(newBirthDate) => {
              setBirthDate(newBirthDate);
            }}
            inputFormat="dd.MM.yyyy"
            mask="__.__.____"
          />
        </LocalizationProvider>
        <Autocomplete
          disablePortal
          disableListWrap={true}
          options={ageOptions}
          forcePopupIcon={false}
          disableClearable
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Věk"
              sx={{ width: 100, pr: 0 }}
            />
          )}
        />
        <AnimalSelector />
      </Stack>
    </Stack>
  );
}
