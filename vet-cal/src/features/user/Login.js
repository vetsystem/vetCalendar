import React from "react";
import { useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { useGetDoctorsQuery } from "../doctors/doctorsSlice";
import { login } from "./userSlice";

export default function Login() {
  const { data: users, isLoading } = useGetDoctorsQuery();
  const [user, setUser] = React.useState(null);
  const dispatch = useDispatch();
  /**
   * Function for saving logged user to redux store
   * @param {Object} doctor Object with doctor data
   */
  const logUser = (doctor) => {
    if (doctor) {
      dispatch(
        login({
          id: doctor.id,
          name: doctor.name,
          initials: doctor.initials,
          color: doctor.color,
        })
      );
    }
  };

  return (
    <>
      <Stack
        direction="column"
        spacing={4}
        sx={{
          mx: "auto",
          maxWidth: 400,
          minHeight: "100vh",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Přihlášení
        </Typography>
        <Autocomplete
          value={user?.id || null}
          onChange={(event, newValue) => {
            setUser(users.entities[newValue]);
          }}
          options={users?.ids || []}
          getOptionLabel={(option) =>
            option ? users.entities[option].name : ""
          }
          isOptionEqualToValue={(option, value) =>
            option ? option === value : true
          }
          loading={isLoading}
          renderInput={(params) => <TextField {...params} label="Uživatel" />}
        />
        <Button onClick={() => logUser(user)}>Vstoupit</Button>
      </Stack>
    </>
  );
}
