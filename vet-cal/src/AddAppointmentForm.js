import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import AppDetailForm from "./AppDetailForm";
import PatientDatailForm from "./PatientDetailForm";

export default function AddAppointmentForm(props) {
  return (
    <Popper
      open={props.open}
      anchorEl={props.anchorEl}
      placement={"bottom-end"}
      popperOptions={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [100, 16],
            },
          },
        ],
      }}
    >
      <Stack
        spacing={1}
        sx={{
          width: 312,
          p: 2,
          bgcolor: "secondary.main",
        }}
      >
        <AppDetailForm />
        <Typography variant="caption" mt={3} sx={{ opacity: 0.87 }}>
          Pacient:
        </Typography>
        <PatientDatailForm />
        <Stack direction="row" justifyContent="end" spacing={1}>
          <Button onClick={props.onClose}>Zavřít</Button>
          <Button variant="contained">Uložit</Button>
        </Stack>
      </Stack>
    </Popper>
  );
}
