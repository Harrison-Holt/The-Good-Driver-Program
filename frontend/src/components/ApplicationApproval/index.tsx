import { Divider, List, ListItem, ListItemText, Typography, Stack, ListItemButton, Box } from "@mui/material";
import { useAppSelector } from "../../store/hooks"
import { selectUserName, selectUserType } from "../../store/userSlice"
import { useEffect, useState } from "react";
import axios from "axios";

interface application {
    application_id: number,
    app_status: string,
    app_description: string,
    driver_id: number,
    driver_username: string
}

const ApplicationApproval: React.FC = () => {

    const [applicationList, setApplicationList] = useState<application[]>([{application_id: 0, app_status: "", app_description: "", driver_id: 0, driver_username: ""}]);
    const [loaded, setLoaded] = useState(false)
    const username = useAppSelector(selectUserName);
    //const usertype = useAppSelector(selectUserType);

    useEffect(() => {
        const fetchAppList = async () => {
            try {
              axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application`).then((response) => {
                let data: application[] = JSON.parse(response.data.body);
                setApplicationList(data);
                setLoaded(true);
                console.log(username); //testing
                console.log('ApplicationList:', data);  // Log the application info
              });
            } catch (error) {
              console.error('Error fetching user info:', error);
            }
        };

        fetchAppList();
    }, [])

    return(
        <>
            {loaded && <List>
                {applicationList.map((app) => (<>
                    <Divider variant="inset" component="li"/>
                    <ListItem key={app.application_id}>
                        <ListItemText
                            primary={<Stack direction="row" spacing={1}>
                                <Typography variant="h6">
                                    {app.driver_username}
                                </Typography>
                                <Typography>
                                    {app.app_status}
                                </Typography>
                            </Stack>}
                            secondary={app.app_description}
                        >
                        </ListItemText>
                        <Box sx={{marginRight: '0px'}}>
                            <ListItemButton>Approve</ListItemButton>
                            <ListItemButton>Deny</ListItemButton>
                        </Box>
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </>))}
            </List>}
        </>
    )
}

export default ApplicationApproval;