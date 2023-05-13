import * as React from "react";
import { useSelector } from "react-redux";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import {
  selectAllRoomEnts,
  selectAllRooms,
  useGetRoomsQuery,
} from "./roomsSlice";

import { getGroupedOpts, getGroups } from "../../utils/getGroupedOpts";

export default function RoomInput({
  multiple,
  onChangeFn,
  selection = [],
  selectedRoomId,
  disabled,
}) {
  // Get room list
  const { isLoading: roomDataLoading } = useGetRoomsQuery();
  const roomOpts = useSelector(selectAllRooms);
  const roomEnts = useSelector(selectAllRoomEnts);

  return (
    <>
      <Autocomplete
        disabled={disabled}
        autoHighlight
        loading={roomDataLoading}
        {...(multiple
          ? { multiple: true, disableCloseOnSelect: true }
          : { value: roomEnts[selectedRoomId] || null })}
        getOptionLabel={(option) => option.name}
        options={getGroupedOpts(selection, roomOpts)}
        {...(selection.length !== 0 ? { groupBy: getGroups } : null)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={onChangeFn ?? undefined}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Místnost" />
        )}
      />
    </>
  );
}
