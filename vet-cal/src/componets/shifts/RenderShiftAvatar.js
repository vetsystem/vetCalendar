import Chip from "@mui/material/Chip";
import { nameToColor } from "../../utils/nameToColor";
import { Tooltip } from "@mui/material";
import { isBefore, parse } from "date-fns";
import { useDeleteShiftMutation } from "../../features/shifts/shiftSlice";

export default function RenderShiftAvatar(props) {
  const [deleteShift] = useDeleteShiftMutation();

  const onDeleteShift = () => {
    deleteShift(props.row[props.field].shiftId).catch((error) => {
      console.log(error);
    });
  };
  const nightShift = () => {
    if (!props.value) return false;
    const shiftTitle = props.value;
    const timeArr = shiftTitle
      .slice(shiftTitle.indexOf(":") + 1)
      .trim()
      .split("-");
    const start = parse(timeArr[0], "HH:mm", new Date());
    const end = parse(timeArr[1], "HH:mm", new Date());
    return isBefore(end, start);
  };
  const fontColor = nightShift() ? "black" : "white";
  return (
    <>
      {props.value ? (
        <>
          <Tooltip title={props.value} placement="top">
            <Chip
              label={props.row.initials}
              size="small"
              sx={{
                bgcolor: nameToColor(props.row.name),
                color: fontColor,
                fontSize: 10,
                fontWeight: 500,
                width: 28,
                "& .MuiChip-label": {
                  p: 0,
                },
                "& .MuiChip-deleteIcon": {
                  display: "none",
                  color: "primary.contrastText",
                },
                "&:hover": {
                  "& .MuiChip-deleteIcon": {
                    display: "block",
                    color: "primary.contrastText",
                    m: 0,
                  },
                  "& .MuiChip-label": {
                    display: "none",
                  },
                },
              }}
              onDelete={onDeleteShift}
            />
          </Tooltip>
        </>
      ) : null}
    </>
  );
}
