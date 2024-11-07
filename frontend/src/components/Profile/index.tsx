import { Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice";
import { useState, useEffect } from "react";
import { fetchPointChangeNotification, updatePointChangeNotification } from "../../utils/api";

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);
    const username = useAppSelector(selectUserName);
    const firstName = useAppSelector(selectFirstName);
    const lastName = useAppSelector(selectLastName);
    const email = useAppSelector(selectEmail);

    // State to hold the notification preference
    const [emailNotifications, setEmailNotifications] = useState(false);

    // Fetch the initial notification preference only once
    useEffect(() => {
        const fetchNotificationPreference = async () => {
            if (username) {
                try {
                    const notificationPreference = await fetchPointChangeNotification(username);
                    console.log("Fetched notification preference:", notificationPreference);  // Debug log
                    if (notificationPreference !== null) {
                        setEmailNotifications(notificationPreference);
                    }
                } catch (error) {
                    console.error("Error fetching notification preference:", error);
                }
            }
        };

        fetchNotificationPreference();
    }, [username]); // Dependency array includes `username` only to fetch once when `username` is available

    // Handle checkbox change
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        
        // Optimistically update the state
        setEmailNotifications(isChecked);
        console.log("Checkbox clicked, setting emailNotifications to:", isChecked); // Debug log

        if (username) {
            try {
                const success = await updatePointChangeNotification(username, isChecked);
                if (!success) {
                    console.error("Failed to update notification preference on server");
                    // Revert state if the API call fails
                    setEmailNotifications(!isChecked);
                }
            } catch (error) {
                console.error("Error updating notification preference:", error);
                // Revert state if an error occurs
                setEmailNotifications(!isChecked);
            }
        } else {
            console.error("Username is null, cannot update notification preference");
        }
    };

    let profile = (<></>);

    if (userType === "driver") {
        profile = (
            <>
                <Typography>Driver Profile</Typography>
                <p>Welcome, {username}!</p>
                <div>
                    <p>Name: {firstName} {lastName}</p>
                    <p>Email: {email}</p>
                    <p>Role: {userType}</p>
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
                </div>
            </>
        );
    } else if (userType === "sponsor") {
        profile = (
            <>
                <Typography>Sponsor Profile</Typography>
                <p>Welcome, {username}!</p>
                <div>
                    <p>Name: {firstName} {lastName}</p>
                    <p>Email: {email}</p>
                    <p>Role: {userType}</p>
                </div>
            </>
        );
    } else if (userType === "admin") {
        profile = (
            <>
                <Typography>Admin Profile</Typography>
                <p>Welcome, {username}!</p>
                <div>
                    <p>Name: {firstName} {lastName}</p>
                    <p>Email: {email}</p>
                    <p>Role: {userType}</p>
                </div>
            </>
        );
    }

    return (
        <>
            {profile}
        </>
    );
};

export default Profile;
