import Navibar from "../../components/Navibar";
import CreateSponsorOrg from "../../components/CreateSponsorOrg";
import { Box } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectUserType } from "../../store/userSlice";
import AddSponsorUser from "../../components/AddSponsorUser";
import DeleteUser from "../../components/DeleteUser";
import ElevateAdmin from "../../components/ElevateAdmin";
import AdminDriverManagement from "../../components/AdminDriverManagement";
import ViewAsDriver from "../../components/ViewAsDriver";

const UserManagement: React.FC = () => {

    const usertype = useAppSelector(selectUserType);

    return (
        <>
            <Navibar/>
            <Box>
                {(usertype === "admin") && <CreateSponsorOrg/>}
                {(usertype === "admin") && <DeleteUser/>}
                {(usertype === "admin") && <ElevateAdmin/>}
                {(usertype === "admin") && <AdminDriverManagement/>}
                {(usertype === "sponsor") && <AddSponsorUser/>}
                {(usertype == "sponsor") && <ViewAsDriver/>}
            </Box>
        </>
    )
}

export default UserManagement;