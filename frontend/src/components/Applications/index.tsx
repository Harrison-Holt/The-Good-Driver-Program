import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import SearchBar from "../SearchBar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAppSelector } from "../../store/hooks"
import { selectUserName, selectUserType } from "../../store/userSlice"


const Applications: React.FC = () => {

    const [sponsorList, setSponsorList] = useState([]);
    const [selectedSponsor, setSelectedSponsor] = useState("");
    const [providedReason, setProvidedReason] = useState("");
    const [submitForm, setSubmitForm] = useState(false);

    const username = useAppSelector(selectUserName);
    const usertype = useAppSelector(selectUserType);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsors');
            let data = await response.json();

            // Parse the `body` which contains the actual JSON data
            data = JSON.parse(data.body);

            console.log('API Response:', data); // Log the response to inspect it
            setSponsorList(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
        console.log(sponsorList);
    }, []);

    useEffect(() => {
        if ( submitForm ) {
            axios.post('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application', {
                sponsorOrg: {selectedSponsor},
                appBody: {providedReason},
                userName: {username},
                applyingUserType: {usertype}
            }).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            })

            setSubmitForm(false);
        }

    }, [submitForm]);

    return (
        <>
            <Box sx={{maxWidth: '95%', maxHeight:'95%', marginLeft: 'auto', marginRight: 'auto', marginTop:'10px'}}>
                <Stack spacing={2}>
                    <Stack direction={"row"} spacing={2}>
                        <Typography>Sponsor List:</Typography>
                        <Box sx={{width: '100%'}}>
                            <SearchBar setSearchTerm={setSelectedSponsor} options={sponsorList} label={"Sponsors"}/>
                        </Box>
                    </Stack>
                    <TextField
                        label={"Application Body"}
                        multiline
                        minRows={5}
                        value={providedReason}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setProvidedReason(event.target.value);
                        }}
                    />
                    <Stack direction={"row"} spacing={2}>
                        <Button onClick={() => {setSubmitForm(true)}}>
                            Submit
                        </Button>
                        <Button onClick={() => {setProvidedReason("")}}>
                            Clear
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default Applications;