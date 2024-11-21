import { Button, Snackbar, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

const ElevateAdmin: React.FC = () => {

    const [elevateUser, setElevateUser] = useState("")
    const [userList, setUserList] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const ElevateUser = async () => {
        try {
            axios.post('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/admins', {
                    username: elevateUser
                }).then((response) => {
                    console.log(response);
                    setSnackMessage("Admin Created");
                    setOpenSnack(true);
                })
        } catch (error) {
            console.error('Error creating admin user:', error);
            setSnackMessage("Error creating admin");
            setOpenSnack(true);
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
    }, [openSnack]);

    return (
        <>
            <Stack direction={"column"} spacing={2}>
                <Typography variant="h6">Elevate User to Admin</Typography>
                <SearchBar setSearchTerm={setElevateUser} options={userList} label="Select User to Elevate" />
                <Button variant={"contained"} onClick={() => {ElevateUser()}}>Submit</Button>
            </Stack>
            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={() => {setOpenSnack(false)}}
                message={snackMessage}
            />
        </>
    )
}

export default ElevateAdmin;