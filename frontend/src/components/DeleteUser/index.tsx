import { Button, Snackbar, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

const DeleteUser: React.FC = () => {

    const [deleteUser, setDeleteUser] = useState("")
    const [userList, setUserList] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState("");

    const DeleteUser = async () => {
        try {
            axios.delete('url',
                {
                    data: {deleteUser}
                }).then((response) => {
                    console.log(response);
                    setSnackMessage("User Deleted");
                    setOpenSnack(true);
                })
        } catch (error) {
            console.error('Error deleting user:', error);
            setSnackMessage("Error deleting user");
            setOpenSnack(true);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/users');
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
                <Typography variant="h6">Delete User</Typography>
                <SearchBar setSearchTerm={setDeleteUser} options={userList} label="Select User to Delete" />
                <Button variant={"contained"} onClick={() => {DeleteUser()}}>Delete</Button>
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

export default DeleteUser;