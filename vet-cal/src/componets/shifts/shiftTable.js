import * as React from "react";

import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";

import {
  useGetShiftsForMonthQuery,
  useGetShiftsQuery,
} from "../../features/shifts/shiftSlice";
import MonthSelector from "./monthSelector";
import { useWindowResize } from "../../utils/useWindowResize";
import {
  selectAllDoctos,
  useGetDoctorsQuery,
} from "../../features/doctors/doctorsSlice";
import { useSelector } from "react-redux";
import {
  eachWeekendOfMonth,
  endOfMonth,
  format,
  formatISO,
  getDate,
  parseISO,
  startOfMonth,
} from "date-fns";
import { getResources } from "../../utils/fhir/fhirUtil";
import RenderShiftAvatar from "./RenderShiftAvatar";
import {
  selectAllRoomEnts,
  useGetRoomsQuery,
} from "../../features/rooms/roomsSlice";

export default function ShiftTable() {
  const { width } = useWindowResize();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());
  const [weekends, setWeekends] = React.useState([]);
  const { isLoading: doctorLoading } = useGetDoctorsQuery();
  const { isLoading: shiftLoading } = useGetShiftsQuery();
  const { data: roomsData, isLoading: roomLoading } = useGetRoomsQuery();
  const doctors = useSelector(selectAllDoctos);
  const rooms = useSelector(selectAllRoomEnts);
  const { data: shiftsForMonth } = useGetShiftsForMonthQuery({
    start: formatISO(startOfMonth(selectedMonth), { representation: "date" }),
    end: formatISO(endOfMonth(selectedMonth), { representation: "date" }),
  });
  const [tableData, setTableData] = React.useState([]);

  React.useEffect(() => {
    const weekendDates = eachWeekendOfMonth(selectedMonth);
    setWeekends(weekendDates.map((date) => getDate(date)));
  }, [selectedMonth]);

  const columns = React.useMemo(() => {
    const shiftColumns = Array.from(Array(32), (v, i) => {
      let columnDef = {
        field: i.toString(),
        headerAlign: "center",
        width: 48,
        minWidth: 48,
        sortable: false,
        renderCell: function (params) {
          return <RenderShiftAvatar {...params} />;
        },
        cellClassName: undefined,
        headerClassName: undefined,
        valueGetter: (params) => {
          return params.row[i]?.label;
        },
      };
      if (weekends.includes(i)) {
        columnDef = {
          ...columnDef,
          cellClassName: "weekend-col",
          headerClassName: "weekend-col",
        };
      }
      return columnDef;
    });
    const nameCol = {
      ...shiftColumns[0],
      field: "name",
      headerName: "Jméno",
      width: 240,
      renderCell: undefined,
      valueGetter: undefined,
      cellClassName: "weekend-col",
      headerClassName: "weekend-col",
    };
    shiftColumns[0] = nameCol;
    return shiftColumns;
  }, [weekends]);

  const transformShifts = React.useCallback(
    (shiftsResources) => {
      const entities = {};
      shiftsResources.forEach((shift) => {
        const doctorId = shift.resource.actor.filter(
          (actor) => actor.type === "Practitioner"
        )[0].reference;
        const roomId = shift.resource.actor.filter(
          (actor) => actor.type === "Location"
        )[0].reference;
        const startDay = getDate(
          parseISO(shift.resource.planningHorizon.start)
        );
        const startTime = format(
          parseISO(shift.resource.planningHorizon.start),
          "HH:mm"
        );
        const endTime = format(
          parseISO(shift.resource.planningHorizon.end),
          "HH:mm"
        );
        const roomName =
          rooms && rooms[roomId] ? rooms[roomId].name : undefined;
        if (!entities[doctorId]) entities[doctorId] = {};
        entities[doctorId][startDay] = {
          label: `${roomName ? roomName + ": " : ""}${startTime}-${endTime}`,
          room: roomId,
          start: shift.resource.planningHorizon.start,
          end: shift.resource.planningHorizon.end,
          shiftId: shift.resource.id,
        };
      });
      return entities;
    },
    [rooms]
  );

  React.useEffect(() => {
    let dataArr = [];
    if (shiftsForMonth) {
      const data = transformShifts(getResources(shiftsForMonth));
      if (!doctorLoading) {
        doctors.forEach((doctor) => {
          const result = { ...doctor, ...data[doctor.id] };
          dataArr.push(result);
        });
      }
    }
    setTableData(dataArr);
  }, [doctorLoading, doctors, shiftsForMonth, transformShifts]);

  return (
    <>
      {doctorLoading || shiftLoading || roomLoading ? null : (
        <Stack
          direction="column"
          alignItems="center"
          sx={{
            "& .weekend-col": {
              bgcolor: "secondary.light",
            },
          }}
        >
          <MonthSelector
            selectedMonth={selectedMonth}
            changeMonth={setSelectedMonth}
          />
          <DataGrid
            rows={tableData}
            columns={columns}
            disableColumnMenu
            hideFooter
            sx={{ width: width - 300 }}
          />
        </Stack>
      )}
    </>
  );
}
