import { Drawer, Button, IconButton} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate} from "react-router-dom";
import { useState } from "react";

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();

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
                {/* TODO: Replace with a list of pages which the user can navigate to */}
                <Button
                    onClick={() => {nav("/")}}
                >
                    Home
                </Button>
            </Drawer>
        </>
    )
}

export default Sidebar;