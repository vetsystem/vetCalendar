import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function DoctorInput() {
  const docOptions = [{ name: "MVDr.Novotná" }, { name: "MVDr.Jelen" }];
  return (
    <>
      <Autocomplete
        disablePortal
        options={docOptions}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Lékař" />
        )}
        getOptionLabel={(option) => `${option.name}`}
      />
    </>
  );
}
