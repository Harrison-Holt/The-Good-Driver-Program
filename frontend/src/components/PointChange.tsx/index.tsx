import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { fetchSponsorDrivers, fetchUserInfo } from '../../utils/api'; 
import audioFeedbackFile from '../../assets/audio_feedback.wav'; // Import audio file
import { useAppSelector } from '../../store/hooks';
import { selectUserName } from '../../store/userSlice';
import SearchBar from '../SearchBar';

const PointChange: React.FC = () => {
  const [driverUsername, setDriverUsername] = useState<string>('');
  const [driverList, setDriverList] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const username = useAppSelector(selectUserName);

  const playAudioFeedback = () => {
    if (!audioFeedbackFile) return; // Ensure the audio file is loaded
    const audio = new Audio(audioFeedbackFile);
    audio.play().catch((err) => console.error('Audio playback failed:', err));
  };

  const handlePointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(Number(event.target.value));
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (username) {
        let userInfo = await fetchUserInfo(username);
        if (userInfo?.sponsor_org_id) {
          const driverInfo = await fetchSponsorDrivers(userInfo.sponsor_org_id.toString())
          var driverUsernames: string[] = [];
          driverInfo?.map((driver) => {
            driverUsernames.push(driver.username)
          })
          setDriverList(driverUsernames)
        }
      }
    }
    fetchData();
  }, [])

  const handleSubmit = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    // Check if the form is complete
    if (!driverUsername || points <= 0 || !reason) {
      setErrorMessage('Please complete all fields before submitting.');
      return;
    }

    try {
      const userInfo = await fetchUserInfo(driverUsername);
      if (!userInfo) {
        setErrorMessage(`User with username ${driverUsername} not found.`);
        return;
      }

      const response = await fetch(
        'https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/team08-points-connection',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: driverUsername,
            points,
            reason,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage(`Points updated successfully for user ${driverUsername}.`);
        playAudioFeedback(); // Play audio feedback only when the form is complete and submission is successful
      } else {
        const errorResponse = await response.json();
        setErrorMessage(`Error updating points: ${errorResponse.message || 'Unknown error'}`);
      }
    } catch (error) {
      setErrorMessage('Error connecting to the API.');
      console.error('Error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6">Update Driver Points</Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {/* <TextField
        label="Driver Username"
        variant="outlined"
        value={driverUsername}
        onChange={handleUsernameChange}
        fullWidth
      /> */}
      <SearchBar setSearchTerm={setDriverUsername} label={"Driver Username"} options={driverList}/>
      <TextField
        type="number"
        label="Points"
        variant="outlined"
        value={points}
        onChange={handlePointChange}
        fullWidth
      />
      <TextField
        label="Reason"
        variant="outlined"
        value={reason}
        onChange={handleReasonChange}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!driverUsername || points <= 0 || !reason} // Disable button if the form is incomplete
      >
        Submit
      </Button>
    </Box>
  );
};

export default PointChange;

