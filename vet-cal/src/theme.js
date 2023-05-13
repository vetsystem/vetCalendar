import { createTheme } from "@mui/material/styles";
import { csCZ as cs } from "@mui/material/locale";
import { csCZ } from "@mui/x-date-pickers/locales";

const customTheme = createTheme(
  {
    palette: {
      primary: {
        main: "#ff6000",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#dddddd",
      },
    },
    typography: {
      hSideMenu: {
        fontFamily: '"Red Hat Display", "Roboto", "sans-serif"',
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: 0,
      },
      hDate: {
        fontFamily: '"Red Hat Display", "Roboto", "sans-serif"',
        fontWeight: 200,
        fontSize: 24,
        letterSpacing: 0,
      },
      hResource: {
        fontFamily: '"Red Hat Display", "Roboto", "sans-serif"',
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: 0,
      },
      hEventTitle1: {
        fontFamily: '"Red Hat Display", "Roboto", "sans-serif"',
        fontWeight: 500,
        fontSize: 18,
        letterSpacing: 0,
        textTransform: "none",
        color: "black",
      },
      hEventTitle2: {
        fontFamily: '"Red Hat Text", "Roboto", "sans-serif"',
        fontWeight: 100,
        fontSize: 16,
        letterSpacing: 0,
        textTransform: "none",
      },
    },
  },
  csCZ,
  cs
);

export default customTheme;
