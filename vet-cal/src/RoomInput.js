import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function DoctorInput() {
  const roomOptions = [{ name: "ordinace" }, { name: "sál" }];
  return (
    <>
      <Autocomplete
        disablePortal
        options={roomOptions}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Místnost" />
        )}
        getOptionLabel={(option) => `${option.name}`}
      />
    </>
  );
}
