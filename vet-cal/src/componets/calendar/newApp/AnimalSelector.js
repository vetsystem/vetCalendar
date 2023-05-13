import React from "react";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { speciesOptions } from "../../../utils/globals";

export default function AnimalSelector({ onChangeSpecies, patientSpec }) {
  const [selectedItem, setSelectedItem] = React.useState(speciesOptions["ca"]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  React.useEffect(() => {
    setSelectedItem(speciesOptions[patientSpec]);
  }, [patientSpec]);

  const handleMenuItemClick = (event, item) => {
    onChangeSpecies((prev) => ({
      ...prev,
      species: { code: item.code, system: item.system, display: item.display },
    }));
    setSelectedItem(item);
    setOpen(false);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <IconButton onClick={handleToggle} sx={{ width: 40, height: 40 }}>
        <FontAwesomeIcon icon={selectedItem.icon} ref={anchorRef} />
      </IconButton>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {Object.values(speciesOptions).map((option, index) => (
                    <MenuItem
                      key={option.code}
                      selected={option === selectedItem}
                      onClick={(event) => handleMenuItemClick(event, option)}
                    >
                      <IconButton>
                        <FontAwesomeIcon icon={option.icon} />
                      </IconButton>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
