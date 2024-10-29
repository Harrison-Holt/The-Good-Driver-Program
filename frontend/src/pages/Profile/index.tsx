import { Typography } from "@mui/material";
import { useAppSelector } from "../../store/hooks"
import { selectEmail, selectFirstName, selectLastName, selectUserName, selectUserType } from "../../store/userSlice"
import Navibar from "../../components/Navibar";

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);
    const username = useAppSelector(selectUserName);
    const firstName = useAppSelector(selectFirstName);
    const lastName = useAppSelector(selectLastName);
    const email = useAppSelector(selectEmail);

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
                </div>
            </>
        )
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
        )
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
        )
    }
    return (
        <>
            <Navibar />
            {profile}
        </>
    )
}

export default Profile;