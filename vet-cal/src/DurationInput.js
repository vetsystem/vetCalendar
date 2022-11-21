import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function DurationInput() {
  const durationOptions = [
    { label: "5 min", duration: 5 },
    { label: "10 min", duration: 10 },
    { label: "15 min", duration: 15 },
    { label: "20 min", duration: 20 },
    { label: "25 min", duration: 25 },
    { label: "30 min", duration: 30 },
    { label: "45 min", duration: 45 },
    { label: "1 hod", duration: 60 },
    { label: "1,5 hod", duration: 90 },
    { label: "2 hod", duration: 120 },
    { label: "2,5 hod", duration: 150 },
    { label: "3 hod", duration: 180 },
    { label: "3,5 hod", duration: 210 },
    { label: "4 hod", duration: 240 },
    { label: "4,5 hod", duration: 270 },
    { label: "5 hod", duration: 300 },
    { label: "5,5 hod", duration: 330 },
    { label: "6 hod", duration: 360 },
    { label: "1 den", duration: 1440 },
  ];
  return (
    <>
      <Autocomplete
        disablePortal
        options={durationOptions}
        defaultValue="15 min"
        isOptionEqualToValue={(option, value) => option.value === value.value}
        handleHomeEndKeys={true}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Doba"
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        sx={{ width: 120 }}
      />
    </>
  );
}
