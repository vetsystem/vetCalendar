import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

const DrawerWidth = 256;

function SideMenu() {
  return (
    <Drawer
      sx={{
        width: DrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DrawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List dense={true}>
        {[
          { label: "Kalendář", link: "/" },
          { label: "Služby", link: "/shifts" },
        ].map(({ label, link }) => (
          <ListItemButton key={label} component={Link} to={link}>
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                fontFamily: '"Red Hat Text", "Roboto", "sans-serif"',
                fontSize: 18,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default SideMenu;
export { DrawerWidth };
