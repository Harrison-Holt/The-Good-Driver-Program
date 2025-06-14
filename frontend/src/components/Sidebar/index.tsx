import { Drawer, IconButton, Box, List, ListItem, ListItemButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectLogin, selectUserType } from "../../store/userSlice";
import { useSettings } from "../../components/Settings/settings_context"; // Import settings context

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();
    const loggedIn = useAppSelector(selectLogin);
    const usertype = useAppSelector(selectUserType);
    const { settings } = useSettings(); // Access settings, including high contrast mode

    const sidebarNavList = (
        <Box
            sx={{
                width: 250,
                backgroundColor: settings.isHighContrast
                    ? "black" // High contrast background
                    : settings.isDarkMode || settings.isGreyscale
                    ? "gray" // Gray background for dark or greyscale mode
                    : "#ffffff", // Default solid white background
                color: settings.isHighContrast
                    ? "white" // High contrast text color
                    : settings.isDarkMode || settings.isGreyscale
                    ? "white" // White text for dark or greyscale mode
                    : "black", // Default text color
            }}
            role="presentation"
            onClick={() => setOpen(false)}
        >
            <List>
                <ListItem>
                    <ListItemButton onClick={() => nav("/")}>Home</ListItemButton>
                </ListItem>
                {loggedIn && (
                    <ListItem>
                        <ListItemButton onClick={() => nav("/profile")}>Profile</ListItemButton>
                    </ListItem>
                )}
                {(usertype === "admin" || usertype === "sponsor") && (
                    <ListItem>
                        <ListItemButton onClick={() => nav("/user-management")}>
                            User Management
                        </ListItemButton>
                    </ListItem>
                )}
                <ListItem>
                    <ListItemButton onClick={() => nav("/settings")}>Settings</ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => nav("/about")}>About</ListItemButton>
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
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: settings.isHighContrast
                            ? "black"
                            : settings.isDarkMode || settings.isGreyscale
                            ? "gray"
                            : "#ffffff", // Same background logic as sidebarNavList
                        color: settings.isHighContrast
                            ? "white"
                            : settings.isDarkMode || settings.isGreyscale
                            ? "white"
                            : "black",
                    },
                }}
            >
                {sidebarNavList}
            </Drawer>
        </>
    );
    
};

export default Sidebar;
