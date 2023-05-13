import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import createDurationLabel from "../../utils/createDurationLabel";

export default function DurationInput({ value, onChangeFn }) {
  const createDurationOptions = () => {
    const minDuration = parseInt(process.env.REACT_APP_MIN_SLOT_DURATION);
    const dayMinutes = 1440;
    const optionsCount = dayMinutes / minDuration;
    const minutesDurations = [...Array(optionsCount + 1)].map((v, i) => {
      const minutes = i * minDuration;
      return {
        duration: minutes,
        label: createDurationLabel(minutes),
      };
    });
    return minutesDurations;
  };
  return (
    <>
      <Autocomplete
        id="durationInput"
        autoHighlight
        disableClearable
        value={value}
        options={createDurationOptions()}
        isOptionEqualToValue={(option, value) =>
          option.duration === parseInt(value.duration)
        }
        handleHomeEndKeys={true}
        onChange={onChangeFn}
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
        sx={{ width: 134 }}
      />
    </>
  );
}
