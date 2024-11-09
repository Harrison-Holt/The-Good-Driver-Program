import { Typography, Box } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice";
import Navibar from "../../components/Navibar";
import { useSettings } from "../../components/Settings/settings_context";

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);
    const username = useAppSelector(selectUserName);
    const firstName = useAppSelector(selectFirstName);
    const lastName = useAppSelector(selectLastName);
    const email = useAppSelector(selectEmail);

    const { settings } = useSettings(); // Access settings from context

    const profileStyle = {
        lineHeight: settings.lineHeight || 1.5,
        textAlign: settings.textAlign || 'left',
        padding: '20px',
    };

    let profile = (<></>);

    if (userType === "driver") {
        profile = (
            <Box sx={profileStyle}>
                <Typography variant="h5">Driver Profile</Typography>
                <Typography>Welcome, {username}!</Typography>
                <Box sx={{ marginTop: '20px' }}>
                    <Typography>Name: {firstName} {lastName}</Typography>
                    <Typography>Email: {email}</Typography>
                    <Typography>Role: {userType}</Typography>
                </Box>
            </Box>
        );
    } else if (userType === "sponsor") {
        profile = (
            <Box sx={profileStyle}>
                <Typography variant="h5">Sponsor Profile</Typography>
                <Typography>Welcome, {username}!</Typography>
                <Box sx={{ marginTop: '20px' }}>
                    <Typography>Name: {firstName} {lastName}</Typography>
                    <Typography>Email: {email}</Typography>
                    <Typography>Role: {userType}</Typography>
                </Box>
            </Box>
        );
    } else if (userType === "admin") {
        profile = (
            <Box sx={profileStyle}>
                <Typography variant="h5">Admin Profile</Typography>
                <Typography>Welcome, {username}!</Typography>
                <Box sx={{ marginTop: '20px' }}>
                    <Typography>Name: {firstName} {lastName}</Typography>
                    <Typography>Email: {email}</Typography>
                    <Typography>Role: {userType}</Typography>
                </Box>
            </Box>
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
