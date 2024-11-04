import { TextField, Typography } from "@mui/material";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";

const UserManagement: React.FC = () => {

    const [orgName, setOrgName] = useState("")
    const [initialSponsorUser, setInitialSponsorUser] = useState("")

    return (
        <>
            <Typography>Create Sponsor Organization</Typography>
            <TextField
                label={"Organization Name"}
                value={orgName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOrgName(event.target.value);
                }}
            />
            <SearchBar setSearchTerm={setInitialSponsorUser} options={[""]} label="Select Sponsor User" />
        </>
    )
}

export default UserManagement;