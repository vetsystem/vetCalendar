import React, { forwardRef, useImperativeHandle } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import AnimalSelector from "../../componets/calendar/newApp/AnimalSelector";
import { useSelector } from "react-redux";
import { selectAllPatients, useGetPatientsQuery } from "./patientsSlice";
import { Typography } from "@mui/material";
import { formatISO, isValid, parseISO, subMonths } from "date-fns";
import countAge from "../../utils/countAge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { speciesOptions } from "../../utils/globals";
import { ageOptions } from "../../utils/globals";

const PatientDatailForm = forwardRef(({ onChange }, ref) => {
  const { isLoading } = useGetPatientsQuery();
  const patients = useSelector(selectAllPatients);
  const initPatient = {
    id: "",
    name: "",
    birthDate: null,
    age: "",
    species: {
      system: "http://fhir.test.com/CodeSystem/AnimalSpecies",
      code: "ca",
      display: "pes",
    },
    owner: "",
    contact: "",
  };
  const [patient, setPatient] = React.useState(initPatient);

  useImperativeHandle(ref, () => {
    return {
      getPatientData() {
        return patient;
      },
    };
  });

  const getContactValue = () => {
    if (typeof patient.contact === "string") return patient.contact;
    const contactsArr = patient.contact.map((contact) => {
      return contact.value;
    });
    return contactsArr.join();
  };

  const addContact = (newVal) => {
    const contactsVals = newVal.split(",");
    const contacts = contactsVals.map((contact) => {
      const phoneRegex = /\b[+]?[0-9 ]{6,16}\b/g;
      if (contact.includes("@")) {
        return {
          system: "email",
          value: contact,
        };
      } else if (phoneRegex.test(contact)) {
        return {
          system: "phone",
          value: contact,
        };
      } else {
        return { system: "other", value: contact };
      }
    });
    return contacts;
  };

  return (
    <Stack spacing={1}>
      <Autocomplete
        freeSolo
        loading={isLoading}
        value={patient.owner}
        onChange={(event, newValue) => {
          // clear value
          if (newValue === null) {
            setPatient(initPatient);
          }
          // new value
          else if (typeof newValue === "string") {
            setPatient((prevState) => ({ ...prevState, owner: newValue }));
          }
          // option value
          else {
            setPatient({
              id: newValue.id,
              name: newValue.name,
              birthDate: newValue.bd,
              age: countAge(newValue.bd),
              species: newValue.species,
              owner: newValue.owner,
              contact: newValue.contact,
            });
          }
        }}
        onInputChange={(event, newValue) => {
          setPatient((prevState) => ({ ...prevState, owner: newValue }));
        }}
        options={patients}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.owner
        }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              <div>
                <Typography variant="body1" sx={{ display: "block" }}>
                  {option.owner}
                </Typography>
                <FontAwesomeIcon
                  icon={speciesOptions[option.species.code].icon}
                />
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {option.name}
                </Typography>
              </div>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Jméno klienta/majitele"
          />
        )}
      />
      <TextField
        variant="standard"
        label="Kontakt"
        value={getContactValue()}
        onChange={(event) => {
          setPatient((prev) => ({
            ...prev,
            contact: addContact(event.target.value),
            id: "",
          }));
        }}
      />
      <Autocomplete
        freeSolo
        loading={isLoading}
        value={patient.name}
        onChange={(event, newValue) => {
          // clear value
          if (newValue === null) {
            setPatient((prev) => ({ ...prev, name: "", id: "" }));
          }
          // new value
          else if (typeof newValue === "string") {
            setPatient((prev) => ({ ...prev, name: newValue }));
          }
          // option value
          else {
            setPatient({
              id: newValue.id,
              name: newValue.name,
              birthDate: newValue.bd,
              age: countAge(newValue.bd),
              species: newValue.species,
              owner: newValue.owner,
              contact: newValue.contact,
            });
          }
        }}
        onInputChange={(event, newValue) => {
          if (newValue !== patient.name)
            setPatient((prevState) => ({
              ...prevState,
              name: newValue,
              id: "",
            }));
        }}
        options={patients}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              <div>
                <Typography variant="body1" sx={{ display: "block" }}>
                  {option.name}
                </Typography>
                <Typography variant="caption">{option.owner}</Typography>
              </div>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Jméno pacienta" />
        )}
      />
      <Stack direction="row" spacing={1} alignItems="flex-end">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
          <DatePicker
            slotProps={{
              textField: {
                variant: "standard",
                InputLabelProps: { shrink: true },
              },
            }}
            label="Datum narození"
            value={
              patient.birthDate === null ? null : parseISO(patient.birthDate)
            }
            onChange={(newBirthDate) => {
              if (isValid(newBirthDate)) {
                const strBirthDate = formatISO(newBirthDate, {
                  representation: "date",
                });
                setPatient((prev) => ({
                  ...prev,
                  birthDate: strBirthDate,
                  age: countAge(strBirthDate),
                }));
              }
            }}
            format="dd.MM.yyyy"
          />
        </LocalizationProvider>
        <Autocomplete
          disableListWrap={true}
          value={patient.age}
          options={ageOptions}
          onChange={(event, newValue) => {
            const age = newValue.label;
            const birthdate = formatISO(
              subMonths(new Date(), newValue.months),
              { representation: "date" }
            );
            setPatient((prev) => ({ ...prev, age: age, birthDate: birthdate }));
          }}
          isOptionEqualToValue={(option, value) => {
            if (typeof value === "string") return true;
            else {
              return option.label === value.label;
            }
          }}
          forcePopupIcon={false}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Věk"
              sx={{ width: 100, pr: 0 }}
            />
          )}
        />
        <AnimalSelector
          onChangeSpecies={setPatient}
          patientSpec={patient.species.code}
        />
      </Stack>
    </Stack>
  );
});

export default PatientDatailForm;
