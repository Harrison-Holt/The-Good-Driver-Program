import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Sidebar from "../Sidebar";
import LoginButton from "../LoginButton";

const Navibar = () => {
    const [points, setPoints] = useState(0);

    // Fetch points from the database when the component mounts
    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/about'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch points');
                }
                const data = await response.json();
                setPoints(data.points); // Adjust based on your API response structure
            } catch (error) {
                console.error('Error fetching points:', error);
            }
        };

        fetchPoints();
    }, []);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Sidebar />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Team 08
                </Typography>
                <LoginButton />
                <Button color="inherit" sx={{ ml: 2 }}>Points: {points}</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navibar;
