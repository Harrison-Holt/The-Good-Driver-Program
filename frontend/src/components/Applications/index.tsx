import React, { useEffect, useState } from "react";
import { Box, Button, Snackbar, Stack, TextField, Typography, useTheme } from "@mui/material";
import SearchBar from "../SearchBar";
import axios from "axios";
import { useAppSelector } from "../../store/hooks";
import { selectUserName, selectUserType } from "../../store/userSlice";
import ApplicationApproval from "../ApplicationApproval";
import { useSettings } from "../../components/Settings/settings_context";
import audioFeedbackFile from "../../assets/audio_feedback.wav";

const Applications: React.FC = () => {
  const [sponsorList, setSponsorList] = useState<string[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState("");
  const [providedReason, setProvidedReason] = useState("");
  const [submitForm, setSubmitForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnack, setOpenSnack] = useState(false);

  const username = useAppSelector(selectUserName);
  const usertype = useAppSelector(selectUserType);

  const theme = useTheme();
  const { settings } = useSettings();

  const playAudioFeedback = () => {
    const audio = new Audio(audioFeedbackFile);
    audio.play().catch((err) => console.error("Audio playback failed:", err));
  };

  // Container styling based on high contrast and dark mode settings
  const containerStyles = {
    maxWidth: "95%",
    maxHeight: "95%",
    margin: "10px auto",
    padding: "20px",
    backgroundColor: settings.isHighContrast
      ? "#000" // High contrast: solid black
      : theme.palette.mode === "dark"
      ? theme.palette.background.default // Dark mode
      : "#ffffff", // Light mode
    color: settings.isHighContrast ? "#fff" : theme.palette.text.primary,
    filter: settings.isGreyscale ? "grayscale(100%)" : "none",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  };

  const buttonStyles = {
    color: settings.isHighContrast ? "#FFD700" : theme.palette.primary.main, // High contrast yellow accent
    backgroundColor: settings.isHighContrast ? "#333" : undefined,
    "&:hover": {
      backgroundColor: settings.isHighContrast ? "#555" : theme.palette.action.hover,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/sponsors"
        );
        const data = JSON.parse(response.data.body);
        setSponsorList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (submitForm) {
      axios
        .post(
          "https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/application",
          {
            sponsorOrg: selectedSponsor,
            appBody: providedReason,
            userName: username,
            applyingUserType: usertype,
          }
        )
        .then((response) => {
          console.log(response);
          setOpenSnack(true);
          playAudioFeedback(); // Play audio feedback on successful submission
        })
        .catch((error) => {
          console.log(error);
        });
      setSubmitForm(false);
    }
  }, [submitForm, selectedSponsor, providedReason, username, usertype]);

  const handleSubmit = () => {
    setErrorMessage(null);

    if (!selectedSponsor || !providedReason) {
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    setSubmitForm(true);
  };

  let appPage = <></>;
  if (usertype === "driver") {
    appPage = (
      <Stack spacing={2}>
        {errorMessage && (
          <Typography
            color="error"
            sx={{ textAlign: "center", marginBottom: "16px" }}
          >
            {errorMessage}
          </Typography>
        )}
        <Stack direction="row" spacing={2}>
          <Typography sx={{ color: containerStyles.color }}>Sponsor List:</Typography>
          <Box sx={{ width: "100%" }}>
            <SearchBar
              setSearchTerm={setSelectedSponsor}
              options={sponsorList}
              label="Sponsors"
            />
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
            backgroundColor: settings.isHighContrast
              ? "#222"
              : theme.palette.background.paper,
          }}
        />
        <Stack direction="row" spacing={2}>
          <Button onClick={handleSubmit} sx={buttonStyles}>
            Submit
          </Button>
          <Button
            onClick={() => setProvidedReason("")}
            sx={buttonStyles}
          >
            Clear
          </Button>
        </Stack>
        <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={() => {setOpenSnack(false)}}
            message={"Application Submitted"}
        />
      </Stack>
    );
  } else {
    appPage = <ApplicationApproval />;
  }

  return <Box sx={containerStyles}>{appPage}</Box>;
};

export default Applications;

