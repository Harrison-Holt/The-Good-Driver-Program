import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

const CreateSponsorOrg: React.FC = () => {

    const [orgName, setOrgName] = useState("")
    const [initialSponsorUser, setInitialSponsorUser] = useState("")
    const [userList, setUserList] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/drivers');
            let data = await response.json();

            // Parse the `body` which contains the actual JSON data
            data = JSON.parse(data.body);

            console.log('API Response:', data); // Log the response to inspect it
            setUserList(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
    }, []);

    return (
        <>
            <Stack direction={"column"} spacing={2}>
                <Typography variant="h6">Create Sponsor Organization</Typography>
                <TextField
                    label={"Organization Name"}
                    value={orgName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setOrgName(event.target.value);
                    }}
                />
                <SearchBar setSearchTerm={setInitialSponsorUser} options={userList} label="Select Sponsor User" />
                <Button variant={"contained"} onClick={() => {createSponsorOrg()}}>Submit</Button>
            </Stack>
        </>
    )
}

export default CreateSponsorOrg;