import { Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import { fetchUserInfo, fetchUserPoints } from "../../utils/api";

const AdminDriverManagement: React.FC = () => {

    const [currentUser, setcurrentUser] = useState("");
    const [userPoints, setUserPoints] = useState<number | null>(null);
    const [userList, setUserList] = useState([]);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const loadPoints = async () => {
            if (currentUser) {
                try {
                    // Fetch points based on the logged-in username
                    const userPoints = await fetchUserPoints(currentUser);
                    setUserPoints(userPoints !== null ? userPoints : 0); // Set to 0 if points are null
                } catch (error) {
                    console.error("Error fetching user points:", error);
                    setUserPoints(0); // Set points to 0 if there's an error
                }
            } else {
                setUserPoints(0); // Set to 0 if no user is logged in
            }
        };

        const loadInfo = async () => {
            const info = await fetchUserInfo(currentUser)
            setUserInfo(info)
        }

        if (currentUser != "") {
            loadInfo();
            loadPoints();
        }
    }, [currentUser]);

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
                <Typography variant="h6">View Driver Information</Typography>
                <SearchBar setSearchTerm={setcurrentUser} options={userList} label="Select Driver to View" />
                <Stack direction={"row"} spacing={3}>
                    {userInfo && <Stack direction={"column"} spacing={2}>
                        <Typography>Username: {currentUser}</Typography>
                        <Typography>Name: {userInfo.first_name} {userInfo.last_name}</Typography>
                        <Typography>Email: {userInfo.email}</Typography>
                    </Stack>}
                    {(userPoints != null && userInfo) && <Stack direction={"column"} spacing={2}>
                        <Typography>Points: {userPoints}</Typography>
                    </Stack>}
                </Stack>
            </Stack>
        </>
    )
}

export default AdminDriverManagement;