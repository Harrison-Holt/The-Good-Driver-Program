import { Typography } from "@mui/material";
import { useAppSelector } from "../../store/hooks"
import { selectUserType } from "../../store/userSlice"
import Navibar from "../../components/Navibar";

const Profile: React.FC = () => {
    const userType = useAppSelector(selectUserType);

    var profile = (<></>);

    if (userType === "driver") {
        profile = (
            <Typography>Driver Profile</Typography>
        )
    } else if (userType === "sponsor") {
        profile = (
            <Typography>Sponsor Profile</Typography>
        )
    } else if (userType === "admin") {
        profile = (
            <Typography>Admin Profile</Typography>
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