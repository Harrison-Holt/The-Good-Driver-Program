import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice";
import { fetchPointChangeNotification, updatePointChangeNotification, updateUserName } from "../../utils/api";

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);
    const username = useAppSelector(selectUserName);
    const firstName = useAppSelector(selectFirstName);
    const lastName = useAppSelector(selectLastName);
    const email = useAppSelector(selectEmail);

    const [newFirstName, setNewFirstName] = useState<string>(firstName || '');
    const [newLastName, setNewLastName] = useState<string>(lastName || '');
    const [newEmail, setNewEmail] = useState<string>(email || '');
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchNotificationPreference = async () => {
            if (username) {
                try {
                    const notificationPreference = await fetchPointChangeNotification(username);
                    if (notificationPreference !== null) {
                        setEmailNotifications(notificationPreference);
                    }
                } catch (error) {
                    console.error("Error fetching notification preference:", error);
                }
            }
        };

        fetchNotificationPreference();
    }, [username]);

    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setEmailNotifications(isChecked);

        if (username) {
            try {
                const success = await updatePointChangeNotification(username, isChecked);
                if (!success) {
                    alert("Failed to update notification preference on server");
                    setEmailNotifications(!isChecked);
                }
            } catch (error) {
                console.error("Error updating notification preference:", error);
                setEmailNotifications(!isChecked);
            }
        }
    };

    const handleProfileUpdate = async () => {
        if (username) {
            try {
                const response = await updateUserName(username, newFirstName, newLastName, newEmail);
                if (response) {
                    alert("Profile updated successfully");
                } else {
                    alert("Failed to update profile");
                }
            } catch (error) {
                if (error instanceof Error) {
                    alert(`Error updating profile: ${error.message}`);
                } else {
                    alert("An unexpected error occurred");
                }
            }
        } else {
            alert("Username is null, cannot update profile");
        }
    };


    //const printOrderHist = async () => {
    
    const orderHist = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    for (const i of orderHist) {
        for (const j of i.items) {
            console.log(i.orderId + ": " + j[1]);
        }
    };
    console.log("Done listing orders!");

    //}

    return (
        <div>
            <Typography variant="h5">{userType === "driver" ? "Driver Profile" : userType === "sponsor" ? "Sponsor Profile" : "Admin Profile"}</Typography>
            <Typography>Welcome, {username}!</Typography>
            <Typography>Name: {firstName} {lastName}</Typography>
            <Typography>Email: {email}</Typography>
            <Typography>Role: {userType}</Typography>
            
            <FormControlLabel
                control={
                    <Checkbox
                        checked={emailNotifications}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                }
                label="Receive notifications for point changes"
            />

            <div>
                <Typography>Order History</Typography>
            </div>

            {isEditing ? (
                <>
                    <TextField
                        label="First Name"
                        variant="outlined"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleProfileUpdate}
                        sx={{ marginTop: 2 }}
                    >
                        Submit
                    </Button>
                </>
            ) : (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    sx={{ marginTop: 2 }}
                >
                    Edit Profile
                </Button>
            )}
        </div>
    );
};

export default Profile;
