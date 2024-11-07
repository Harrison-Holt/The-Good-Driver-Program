import { Button, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import { useAppSelector } from "../../store/hooks";
import { selectUserName } from "../../store/userSlice";

const AddSponsorUser: React.FC = () => {

    const [newSponsorUser, setNewSponsorUser] = useState("")
    const [userList, setUserList] = useState([]);

    const username = useAppSelector(selectUserName);

    const AddSponsorUser = async () => {
        try {
            axios.patch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsors', {
                curr_sponsor_user: username,
                new_sponsor_user: newSponsorUser
            }).then((response) => {
                console.log(response);
            });
        } catch (error) {
            console.error('Error adding sponsor user:', error);
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
                <Typography variant="h6">Add New Sponsor User</Typography>
                <SearchBar setSearchTerm={setNewSponsorUser} options={userList} label="Select New Sponsor User" />
                <Button variant={"contained"} onClick={() => {AddSponsorUser()}}>Submit</Button>
            </Stack>
        </>
    )
}

export default AddSponsorUser;