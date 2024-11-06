import Navibar from "../../components/Navibar";
import CreateSponsorOrg from "../../components/CreateSponsorOrg";
import { Box } from "@mui/material";

const UserManagement: React.FC = () => {

    return (
        <>
            <Navibar/>
            <Box>
                <CreateSponsorOrg/>
            </Box>
        </>
    )
}

export default UserManagement;