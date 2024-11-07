import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography, useTheme } from "@mui/material";
import SearchBar from "../SearchBar";
import axios from "axios";
import { useAppSelector } from "../../store/hooks";
import { selectUserName, selectUserType } from "../../store/userSlice";
import ApplicationApproval from "../ApplicationApproval";
import { useSettings } from "../../components/Settings/settings_context";

const Applications: React.FC = () => {
  const [sponsorList, setSponsorList] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [providedReason, setProvidedReason] = useState("");
  const [submitForm, setSubmitForm] = useState(false);

  const username = useAppSelector(selectUserName);
  const usertype = useAppSelector(selectUserType);

  const theme = useTheme();
  const { settings } = useSettings();

  // Container styling based on high contrast and dark mode settings
  const containerStyles = {
    maxWidth: '95%',
    maxHeight: '95%',
    margin: '10px auto',
    padding: '20px',
    backgroundColor: settings.isHighContrast
      ? '#000'  // High contrast: solid black
      : theme.palette.mode === 'dark'
      ? theme.palette.background.default  // Dark mode
      : '#ffffff',  // Light mode
    color: settings.isHighContrast ? '#fff' : theme.palette.text.primary,
    filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  };

  const buttonStyles = {
    color: settings.isHighContrast ? '#FFD700' : theme.palette.primary.main,  // High contrast yellow accent
    backgroundColor: settings.isHighContrast ? '#333' : undefined,
    '&:hover': {
      backgroundColor: settings.isHighContrast ? '#555' : theme.palette.action.hover,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsors');
        let data = await response.json();
        data = JSON.parse(data.body);
        setSponsorList(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (submitForm) {
      axios.post('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application', {
        sponsorOrg: selectedSponsor,
        appBody: providedReason,
        userName: username,
        applyingUserType: usertype,
      }).then(response => {
        console.log(response);
      }).catch(error => {
        console.log(error);
      });

      setSubmitForm(false);
    }
  }, [submitForm, selectedSponsor, providedReason, username, usertype]);

  let appPage = (<></>);
  if (usertype === "driver") {
    appPage = (
      <Stack spacing={2}>
        <Stack direction={"row"} spacing={2}>
          <Typography sx={{ color: containerStyles.color }}>Sponsor List:</Typography>
          <Box sx={{ width: '100%' }}>
            <SearchBar setSearchTerm={setSelectedSponsor} options={sponsorList} label="Sponsors" />
          </Box>
        </Stack>
        <TextField
          label="Application Body"
          multiline
          minRows={5}
          value={providedReason}
          onChange={(event) => setProvidedReason(event.target.value)}
          sx={{
            color: containerStyles.color,
            backgroundColor: settings.isHighContrast ? '#222' : theme.palette.background.paper,
          }}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={() => setSubmitForm(true)} sx={buttonStyles}>Submit</Button>
          <Button onClick={() => setProvidedReason("")} sx={buttonStyles}>Clear</Button>
        </Stack>
      </Stack>
    );
  } else {
    appPage = <ApplicationApproval />;
  }

  return (
    <Box sx={containerStyles}>
      {appPage}
    </Box>
  );
};

export default Applications;
