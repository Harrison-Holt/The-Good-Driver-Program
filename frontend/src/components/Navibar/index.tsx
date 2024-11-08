import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Sidebar from "../Sidebar";
import LoginButton from "../LoginButton";
import { fetchUserPoints } from "../../utils/api";
import { useSelector } from 'react-redux';
import { selectUserName } from '../../store/userSlice';
import { useSettings } from '../Settings/settings_context';

const Navibar = () => {
    const username = useSelector(selectUserName);
    const { settings } = useSettings();
    const [points, setPoints] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<string>("");

    // Fetch user points
    useEffect(() => {
        const loadPoints = async () => {
            if (username) {
                try {
                    const userPoints = await fetchUserPoints(username);
                    setPoints(userPoints !== null ? userPoints : 0);
                } catch (error) {
                    console.error("Error fetching user points:", error);
                    setPoints(0);
                }
            } else {
                setPoints(0);
            }
        };

        loadPoints();
    }, [username]);

    // Update the current time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: settings.timezone || 'UTC',
            };
            setCurrentTime(now.toLocaleTimeString(undefined, options));
        };

        updateTime(); // Set the initial time
        const timerId = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(timerId); // Cleanup on unmount
    }, [settings.timezone]);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Sidebar />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Team 08
                </Typography>
                <Typography variant="body1" sx={{ mr: 2 }}>
                    {currentTime} {/* Display the current time */}
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
