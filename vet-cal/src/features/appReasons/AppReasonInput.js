import React from "react";
import { useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import AppReasonDialog from "./AppReasonDialog";

import { selectAllAppReasons, useGetAppReasonsQuery } from "./appReasonsSlice";

const filter = createFilterOptions();

export default function AppReasonInput({ onChange }) {
  const { isLoading } = useGetAppReasonsQuery();
  const appReasonsOptions = useSelector(selectAllAppReasons);

  const initValue = {
    id: null,
    label: "",
    room: [],
    doctor: [],
    duration: 0,
  };

  const [value, setValue] = React.useState(initValue);
  const [inputValue, setInputValue] = React.useState("");
  const [open, toggleOpen] = React.useState(false);

  React.useEffect(() => {
    const appReason =
      value.label === "" || value.label !== inputValue
        ? {
            label: inputValue,
            roomSelection: [],
            doctorSelection: [],
            duration: 0,
          }
        : {
            label: value.label,
            roomSelection: value.room,
            doctorSelection: value.doctor,
            ...(value.duration && { duration: value.duration }),
          };
    onChange((prevState) => {
      const newState = {
        ...prevState,
        appReason: appReason.label,
        roomSelection: appReason.roomSelection,
        doctorSelection: appReason.doctorSelection,
        ...(appReason.duration && { duration: appReason.duration }),
      };
      return newState;
    });
  }, [value, inputValue, onChange]);

  const handleOpen = () => {
    toggleOpen(!open);
  };
  return (
    <>
      <Autocomplete
        autoHighlight
        loading={isLoading}
        value={value}
        onChange={(event, newValue) => {
          // Adding new option with appointment reason
          if (typeof newValue === "string") {
            setValue({ ...value, id: null, label: newValue.inputValue });
          } else if (newValue && newValue.inputValue) {
            setValue({ ...value, id: null, label: newValue.inputValue });
            handleOpen();
          }
          // selecting appointment reason from selection
          else {
            // clear input
            if (newValue === null) {
              setValue(initValue);
            }
            // some selected option
            else {
              setValue(newValue);
            }
          }
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              label: `+ "${params.inputValue}"`,
            });
          }
          return filtered;
        }}
        options={appReasonsOptions}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.label;
          }
          // Regular option
          return option.label;
        }}
        selectOnFocus
        clearOnBlur={false}
        handleHomeEndKeys
        freeSolo
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Důvod návštěvy" />
        )}
      />
      <AppReasonDialog
        newAppReason={value.label}
        onAppReasonSave={setValue}
        open={open}
        handleClose={() => {
          toggleOpen(false);
        }}
      />
    </>
  );
}
