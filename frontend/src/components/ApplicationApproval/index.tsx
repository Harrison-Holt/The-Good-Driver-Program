import { Divider, List, ListItem, ListItemText, Typography, Stack, ListItemButton, Box } from "@mui/material";
import { useAppSelector } from "../../store/hooks"
import { selectUserName } from "../../store/userSlice"
import { useEffect, useState } from "react";
import axios from "axios";

interface application {
    application_id: number,
    app_status: string,
    app_description: string,
    sponsor_id: number,
    driver_id: number,
    driver_username: string
}

const ApplicationApproval: React.FC = () => {

    const [applicationList, setApplicationList] = useState<application[]>([{application_id: 0, app_status: "", app_description: "", sponsor_id: 0, driver_id: 0, driver_username: ""}]);
    const [loaded, setLoaded] = useState(false)
    const username =  useAppSelector(selectUserName);
    //const usertype = useAppSelector(selectUserType);

    useEffect(() => {
        const fetchAppList = async () => {
            try {
              axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application`, {
                params: {
                    name: username
                }
              }).then((response) => {
                console.log(response)
                let data: application[] = response.data
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
    }, [loaded])

    const handleApplicationUpdate = async (appId: number, driverId: number, newStatus: string, sponsorId: number) => {
        try {
            axios.patch(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application`, {
              app_id: appId,
              driver_id: driverId,
              sponsor_id: sponsorId,
              status: newStatus
            }).then((response) => {
              console.log(response)
              setLoaded(false);
            });
          } catch (error) {
            console.error('Error updating application:', error);
          }
    }

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
                        {app.app_status === "pending" ? <Box sx={{marginRight: '0px'}}>
                            <ListItemButton onClick={() => {handleApplicationUpdate(app.application_id, app.driver_id, "accepted", app.sponsor_id)}}>Approve</ListItemButton>
                            <ListItemButton onClick={() => {handleApplicationUpdate(app.application_id, app.driver_id, "denied", app.sponsor_id)}}>Deny</ListItemButton>
                        </Box> : <></>}
                    </ListItem>
                    <Divider variant="inset" component="li"/>
                </>))}
            </List>}
        </>
    )
}

export default ApplicationApproval;