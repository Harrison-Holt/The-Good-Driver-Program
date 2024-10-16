import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import Navibar from "../../components/Navibar"
import SearchBar from "../../components/SearchBar"
import { useEffect, useState } from "react"
import axios from "axios"


const Applications: React.FC = () => {

    const [sponsorList, setSponsorList] = useState([]);
    const [submitForm, setSubmitForm] = useState(false);

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
                sponsorOrg: "test",
                appBody: "testing",
                applyingUserType: "driver"
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
            <Navibar/>
            <Box sx={{maxWidth: '95%', maxHeight:'95%', marginLeft: 'auto', marginRight: 'auto', marginTop:'10px'}}>
                <Stack spacing={2}>
                    <Stack direction={"row"} spacing={2}>
                        <Typography>Sponsor List:</Typography>
                        <Box sx={{width: '100%'}}>
                            <SearchBar options={sponsorList} label={"Sponsors"}/>
                        </Box>
                    </Stack>
                    <TextField
                        label={"Application Body"}
                        multiline
                        minRows={5}
                    />
                    <Stack direction={"row"} spacing={2}>
                        <Button onClick={() => {setSubmitForm(true)}}>
                            Submit
                        </Button>
                        <Button>
                            Clear
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default Applications;