// Sidebar.tsx
import { Drawer, IconButton, Box, List, ListItem, ListItemButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectLogin } from "../../store/userSlice";

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const loggedIn = useAppSelector(selectLogin);

  const sidebarNavList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
      <List>
        <ListItem>
          <ListItemButton onClick={() => nav("/")}>Home</ListItemButton>
        </ListItem>
        {loggedIn && (
          <ListItem>
            <ListItemButton onClick={() => nav("/profile")}>Profile</ListItemButton>
          </ListItem>
        )}
        <ListItem>
          <ListItemButton onClick={() => nav("/about")}>About</ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => nav("/settings")}>Settings</ListItemButton> {/* Link to settings */}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        {sidebarNavList}
      </Drawer>
    </>
  );
};

export default Sidebar;
