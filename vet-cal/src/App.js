import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";

import customTheme from "./theme";
import SideMenu from "./componets/SideMenu";
import Calendar from "./componets/calendar/Calendar";
import Shifts from "./componets/shifts/Shifts";
import { setHeight } from "./features/window/windowSlice";
import { useWindowResize } from "./utils/useWindowResize";
import { useDispatch } from "react-redux";
import Login from "./features/user/Login";

// TODO load shifts data

function App() {
  const dispatch = useDispatch();
  const { height } = useWindowResize();
  React.useEffect(() => {
    dispatch(setHeight(height));
  }, [dispatch, height]);
  /* const shiftStartInterval = formatISO(subDays(new Date(), 7), {
    representation: "date",
  });
  const { isLoading: shifts } = useGetShiftsQuery({
    date: `gt${shiftStartInterval}`,
    _count: 1000,
  }); */
  const user = useSelector((state) => state.user);

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={customTheme}>
        {user.id ? (
          <>
            <Box sx={{ display: "flex" }}>
              <SideMenu />
              <Routes>
                <Route path="/" element={<Calendar />}></Route>
                <Route path="/shifts" element={<Shifts />}></Route>
              </Routes>
            </Box>
          </>
        ) : (
          <Login />
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
