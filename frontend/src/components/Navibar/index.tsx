import { AppBar, Typography, Button, Toolbar, Box } from "@mui/material"
import { useNavigate} from "react-router-dom";
import Sidebar from "../Sidebar";

const Navibar: React.FC = () => {
    const nav = useNavigate();

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
                    <Button
                        variant="contained"
                        onClick={/*Navigate to login page*/()=>{nav("/")}}
                    >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navibar;