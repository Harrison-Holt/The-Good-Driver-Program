import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

const UserManagement: React.FC = () => {

    const [orgName, setOrgName] = useState("")
    const [initialSponsorUser, setInitialSponsorUser] = useState("")

    const createSponsorOrg = async () => {
        try {
            axios.post('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsors', {
                org_name: orgName,
                initial_sponsor_user: initialSponsorUser
            }).then((response) => {
                console.log(response);
            });
        } catch (error) {
            console.error('Error creating sponsor:', error);
        }
    }

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
            <Button onClick={() => {createSponsorOrg()}}>Submit</Button>
        </>
    )
}

export default UserManagement;