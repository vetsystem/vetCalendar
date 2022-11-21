import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import { Avatar, IconButton, InputAdornment, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import SearchIcon from "@mui/icons-material/Search";

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
        <ListItem>
          <Avatar>OP</Avatar>
        </ListItem>
        <ListItem>
          <Typography variant="hSideMenu" color="initial">
            MVDr. Otakar Procházka
          </Typography>
        </ListItem>
        <ListItem>
          <TextField
            id="search-field"
            variant="standard"
            type="search"
            margin="none"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="hledat" edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </ListItem>
        {["Kalendář", "Služby", "Změnit heslo", "Odhlásit"].map((text) => (
          <ListItem button key={text}>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontFamily: '"Red Hat Text", "Roboto", "sans-serif"',
                fontSize: 18,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SideMenu;
export { DrawerWidth };
