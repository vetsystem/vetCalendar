import React from "react";
import { useSelector } from "react-redux";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";

import {
  selectAllDoctos,
  selectDocsEnts,
  useGetDoctorsQuery,
} from "./doctorsSlice";

import { getGroupedOpts, getGroups } from "../../utils/getGroupedOpts";
import { Chip } from "@mui/material";

export default function DoctorInput({
  multiple,
  onChangeFn,
  selection = [],
  selectedDoctorId,
  disabled,
}) {
  // Get doctors list
  const { isLoading: doctorDataLoading } = useGetDoctorsQuery();
  const docOpts = useSelector(selectAllDoctos);
  const doctorEnts = useSelector(selectDocsEnts);

  return (
    <>
      <Autocomplete
        id="doctorInput"
        disabled={disabled}
        autoHighlight
        loading={doctorDataLoading}
        {...(multiple
          ? { multiple: true, disableCloseOnSelect: true }
          : { value: doctorEnts[selectedDoctorId] || null })}
        getOptionLabel={(el) => el.name}
        options={getGroupedOpts(selection, docOpts)}
        {...(selection.length !== 0 ? { groupBy: getGroups } : null)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={onChangeFn}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  fontSize: 12,
                  bgcolor: option.color,
                }}
              >
                {option.initials}
              </Avatar>
              {option.name}
            </li>
          );
        }}
        renderTags={(value, props) => {
          return value.map((option, index) => (
            <Chip
              {...props({ index })}
              label={option.name}
              sx={{ bgcolor: option.color, color: "white" }}
            />
          ));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Lékař"
            name="doctor"
          />
        )}
      />
    </>
  );
}
