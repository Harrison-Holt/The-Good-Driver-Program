import { Drawer, IconButton, Box, List, ListItem, ListItemButton} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate} from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectLogin, selectUserType } from "../../store/userSlice";

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();
    const loggedIn = useAppSelector(selectLogin);
    const usertype = useAppSelector(selectUserType);

    const sidebarNavList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => {setOpen(false)}}>
            <List>
                <ListItem>
                    <ListItemButton
                        onClick={() => {nav("/")}}
                    >
                        Home
                    </ListItemButton>
                </ListItem>
                {loggedIn && <ListItem>
                    <ListItemButton
                        onClick={() => {nav("/profile")}}
                    >
                        Profile
                    </ListItemButton>
                </ListItem>}
                {(usertype === "admin" || usertype === "sponsor") && <ListItem>
                    <ListItemButton
                        onClick={() => {nav("/user-management")}}
                    >
                        User Management
                    </ListItemButton>
                </ListItem>}
                <ListItem>
                    <ListItemButton
                        onClick={() => {nav("/about")}}
                    >
                        About
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )

    return (
        <>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => {setOpen(true)}}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                open={open}
                onClose={() => {setOpen(false)}}
            >
                {sidebarNavList}
            </Drawer>
        </>
    )
}

export default Sidebar;