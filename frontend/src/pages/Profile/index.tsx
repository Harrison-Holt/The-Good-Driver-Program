import { Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice";
import Navibar from "../../components/Navibar";
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

    // Fetch the initial notification preference
    useEffect(() => {
        const fetchNotificationPreference = async () => {
            if (username) {  // Ensure username is not null
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

    // Handle checkbox change
const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setEmailNotifications(isChecked);

    if (username) {  // Ensure username is not null
        try {
            const success = await updatePointChangeNotification(username, isChecked);
            if (!success) {
                console.error("Failed to update notification preference");
                setEmailNotifications(!isChecked);  // Revert if update fails
            }
        } catch (error) {
            console.error("Error updating notification preference:", error);
        }
    } else {
        console.error("Username is null, cannot update notification preference");
        setEmailNotifications(!isChecked);  // Revert since username is null
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
            <Navibar />
            {profile}
        </>
    );
};

export default Profile;
