import Navibar from "../../components/Navibar";
import CreateSponsorOrg from "../../components/CreateSponsorOrg";
import { Box } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectUserType } from "../../store/userSlice";
import AddSponsorUser from "../../components/AddSponsorUser";

const UserManagement: React.FC = () => {

    const usertype = useAppSelector(selectUserType);

    return (
        <>
            <Navibar/>
            <Box>
                {(usertype === "admin") && <CreateSponsorOrg/>}
                {(usertype === "sponsor") && <AddSponsorUser/>}
            </Box>
        </>
    )
}

export default UserManagement;