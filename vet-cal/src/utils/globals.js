import { faDog } from "@fortawesome/free-solid-svg-icons/faDog";
import { faCat } from "@fortawesome/free-solid-svg-icons/faCat";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";

const speciesOptions = {
  ca: {
    icon: faDog,
    system: "http://fhir.test.com/CodeSystem/AnimalSpecies",
    code: "ca",
    display: "pes",
  },
  fe: {
    icon: faCat,
    system: "http://fhir.test.com/CodeSystem/AnimalSpecies",
    code: "fe",
    display: "kočka",
  },
  un: {
    icon: faQuestionCircle,
    system: "http://fhir.test.com/CodeSystem/AnimalSpecies",
    code: "un",
    display: "neznámý",
  },
};

const ageOptions = [
  { label: "1 měsíc", months: 1 },
  { label: "2 měsíce", months: 2 },
  { label: "3 měsíce", months: 3 },
  { label: "4 měsíce", months: 4 },
  { label: "5 měsíců", months: 5 },
  { label: "6 měsíců", months: 6 },
  { label: "7 měsíců", months: 7 },
  { label: "8 měsíců", months: 8 },
  { label: "9 měsíců", months: 9 },
  { label: "10 měsíců", months: 10 },
  { label: "11 měsíců", months: 11 },
  { label: "1 rok", months: 12 },
  { label: "2 roky", months: 24 },
  { label: "3 roky", months: 36 },
  { label: "4 roky", months: 48 },
  { label: "5 let", months: 60 },
  { label: "6 let", months: 72 },
  { label: "7 let", months: 84 },
  { label: "8 let", months: 96 },
  { label: "9 let", months: 108 },
  { label: "10 let", months: 120 },
  { label: "11 let", months: 132 },
  { label: "12 let", months: 144 },
  { label: "13 let", months: 156 },
  { label: "14 let", months: 168 },
  { label: "15 let", months: 180 },
  { label: "16 let", months: 192 },
  { label: "17 let", months: 204 },
  { label: "18 let", months: 216 },
  { label: "19 let", months: 228 },
  { label: "20 let", months: 240 },
];

export { speciesOptions, ageOptions };
