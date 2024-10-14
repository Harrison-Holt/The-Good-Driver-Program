import { AppBar, Typography, Toolbar, Box, Button, Stack } from "@mui/material"
import Sidebar from "../Sidebar";
import LoginButton from "../LoginButton";
import { useAppSelector } from "../../store/hooks";
import { selectLogin } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const Navibar: React.FC = () => {
    const loggedIn = useAppSelector(selectLogin);
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
                    <Stack direction={"row"} spacing={2}>
                        {loggedIn ?
                            <Button
                                variant="contained"
                                onClick={() => {nav("/profile")}}
                            >
                                Profile
                            </Button> : null}
                        <LoginButton />
                    </Stack>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navibar;