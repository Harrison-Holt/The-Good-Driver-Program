import { Drawer, IconButton, Box, List, ListItem, ListItemButton} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate} from "react-router-dom";
import { useState } from "react";

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();

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
                <ListItem>
                    <ListItemButton
                        onClick={() => {nav("/about")}}
                    >
                        About
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton
                        onClick={() => {window.location.href = "https://team08-domain.auth.us-east-1.amazoncognito.com/login?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d3ggpwrnl4m4is.amplifyapp.com%2F";}}
                    >
                        Logout
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