import React, { useEffect, useState } from "react";
import { Divider, List, ListItem, ListItemText, Typography, Stack, ListItemButton, Box, useTheme } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { selectUserName } from "../../store/userSlice";
import axios from "axios";
import { useSettings } from "../../components/Settings/settings_context";
import SearchBar from "../SearchBar";

interface Application {
  application_id: number;
  app_status: string;
  app_description: string;
  sponsor_id: number;
  driver_id: number;
  driver_username: string;
}

const ApplicationApproval: React.FC = () => {

  const [applicationList, setApplicationList] = useState<Application[]>([{application_id: 0, app_status: "", app_description: "", sponsor_id: 0, driver_id: 0, driver_username: ""}]);
  const [filteredList, setFilteredList] = useState<Application[]>([{application_id: 0, app_status: "", app_description: "", sponsor_id: 0, driver_id: 0, driver_username: ""}]);
  const [loaded, setLoaded] = useState(false)
  const username =  useAppSelector(selectUserName);

  const theme = useTheme();
  const { settings } = useSettings();

  // Define styles based on high contrast and dark mode settings
  const containerStyles = {
    backgroundColor: settings.isHighContrast
      ? '#000000'
      : theme.palette.mode === 'dark'
      ? '#121212'
      : theme.palette.background.default,
    color: settings.isHighContrast ? '#FFFFFF' : theme.palette.text.primary,
    padding: '10px',
    borderRadius: '8px',
    filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
  };

  const buttonStyles = {
    color: settings.isHighContrast ? '#FFD700' : theme.palette.primary.main, // High contrast yellow accent
    margin: '0 5px',
  };

  useEffect(() => {
      const fetchAppList = async () => {
          try {
            axios.get(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application`, {
              params: {
                  name: username
              }
            }).then((response) => {
              console.log(response)
              const data: Application[] = response.data
              setApplicationList(data);
              setFilteredList(data);
              setLoaded(true);
              console.log(username); //testing
              console.log('ApplicationList:', data);  // Log the application info
            });
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
      };

    fetchAppList();
  }, [loaded, username]);

  const handleApplicationUpdate = async (appId: number, driverId: number, newStatus: string, sponsorId: number) => {
    try {
      await axios.patch(`https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application`, {
        app_id: appId,
        driver_id: driverId,
        sponsor_id: sponsorId,
        status: newStatus
      });
      setLoaded(false); // Force reload after update
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const requestFilter = (filterValue: string) => {
      const apps = applicationList.filter((app) => {
          if (app.app_status.toLowerCase().includes(filterValue.toLowerCase())) {
              return app
          } else if (app.driver_username.includes(filterValue)) {
              return app
          }
      });
      setFilteredList(apps)
  }

  return(
      <Box sx={containerStyles}>
          <SearchBar setSearchTerm={requestFilter} label="filter" options={[""]}/>
          {loaded && <List>
              {filteredList.map((app) => (<>
                  <Divider variant="inset" component="li"/>
                  <ListItem key={app.application_id}>
                      <ListItemText
                          primary={<Stack direction="row" spacing={1}>
                              <Typography variant="h6" sx={{ color: containerStyles.color }}>
                                  {app.driver_username}
                              </Typography>
                              <Typography sx={{ color: containerStyles.color }}>
                                  {app.app_status}
                              </Typography>
                          </Stack>}
                          secondary={app.app_description}
                      >
                      </ListItemText>
                      {app.app_status === "pending" ? <Box sx={{marginRight: '0px'}}>
                          <ListItemButton onClick={() => {handleApplicationUpdate(app.application_id, app.driver_id, "accepted", app.sponsor_id)}} sx={buttonStyles}>Approve</ListItemButton>
                          <ListItemButton onClick={() => {handleApplicationUpdate(app.application_id, app.driver_id, "denied", app.sponsor_id)}} sx={buttonStyles}>Deny</ListItemButton>
                      </Box> : <></>}
                  </ListItem>
                  <Divider variant="inset" component="li"/>
              </>))}
          </List>}
      </Box>
  )
}

export default ApplicationApproval;
