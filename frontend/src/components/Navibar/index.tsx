import { AppBar, Typography, Toolbar, Box } from "@mui/material"
import Sidebar from "../Sidebar";
import LoginButton from "../LoginButton";

const Navibar: React.FC = () => {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Sidebar/>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1}}>
                        Team 08
                    </Typography>
                    <LoginButton />
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navibar;