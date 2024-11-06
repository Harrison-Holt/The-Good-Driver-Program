import { Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice";
import Navibar from "../../components/Navibar";
import { useState, useEffect } from "react";
import axios from "axios";

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);
    const username = useAppSelector(selectUserName);
    const firstName = useAppSelector(selectFirstName);
    const lastName = useAppSelector(selectLastName);
    const email = useAppSelector(selectEmail);

    const [emailNotifications, setEmailNotifications] = useState(false);

    // Fetch the initial notification preference
    useEffect(() => {
        const fetchNotificationPreference = async () => {
            try {
                const response = await axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings`, {
                    params: { username }
                });
                setEmailNotifications(response.data.email_notifications);
            } catch (error) {
                console.error("Error fetching notification preference:", error);
            }
        };

        fetchNotificationPreference();
    }, [username]);

    // Handle checkbox change
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setEmailNotifications(isChecked);

        try {
            await axios.patch(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/user_settings`, {
                username,
                email_notifications: isChecked,
            });
        } catch (error) {
            console.error("Error updating notification preference:", error);
        }
    };

    var profile = (<></>);

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
