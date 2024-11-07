import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Sidebar from "../Sidebar";
import LoginButton from "../LoginButton";
import { fetchUserPoints } from "../../utils/api"; // Import the helper function
import { useSelector } from 'react-redux';
import { selectUserName } from '../../store/userSlice'; // Import the selector for username

const Navibar = () => {
    const username = useSelector(selectUserName); // Access the username from Redux
    const [points, setPoints] = useState<number>(0);

    useEffect(() => {
        const loadPoints = async () => {
            if (username) {
                try {
                    // Fetch points based on the logged-in username
                    const userPoints = await fetchUserPoints(username);
                    setPoints(userPoints !== null ? userPoints : 0); // Set to 0 if points are null
                } catch (error) {
                    console.error("Error fetching user points:", error);
                    setPoints(0); // Set points to 0 if there's an error
                }
            } else {
                setPoints(0); // Set to 0 if no user is logged in
            }
        };

        loadPoints();
    }, [username]);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Sidebar />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Team 08
                </Typography>
                <LoginButton />
                <Button color="inherit" sx={{ ml: 2 }}>
                    Points: {points}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navibar;
