import { AppBar, Typography, Button, Toolbar, IconButton, Box } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate} from "react-router-dom";

const Navibar = () => {
    const nav = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1}}>
                        Team 08
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => {nav("/about")}}>
                        About
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navibar;