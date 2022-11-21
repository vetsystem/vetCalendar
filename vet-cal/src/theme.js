import { createTheme } from "@mui/material/styles";
import { csCZ } from "@mui/material/locale";

const customTheme = createTheme(
  {
    palette: {
      primary: {
        main: "#ff6000",
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
    },
  },
  csCZ
);

export default customTheme;
