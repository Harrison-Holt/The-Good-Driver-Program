import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { fetchUserInfo } from '../../utils/api';  // Import your fetchUserInfo function

const PointChange: React.FC = () => {
  const [driverUsername, setDriverUsername] = useState<string>(''); // Updated to accept a username
  const [points, setPoints] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDriverUsername(event.target.value);
  };

  const handlePointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(Number(event.target.value));
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const handleSubmit = async () => {
    // Fetch the user info using the provided username
    const userInfo = await fetchUserInfo(driverUsername);
    if (!userInfo) {
      console.error(`User with username ${driverUsername} not found.`);
      return;
    }

    // Update the user's points based on the input and userInfo
    const updatedPoints = userInfo.points !== null ? userInfo.points + points : points;

    try {
      // Make an API call to update the user's points via a Lambda function
      const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/team08-points-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: driverUsername,
          points: updatedPoints,
          reason: reason,
        }),
      });

      if (response.ok) {
        console.log(`Points updated successfully for user ${driverUsername}.`);
      } else {
        console.error('Error updating points:', await response.json());
      }
    } catch (error) {
      console.error('Error connecting to API:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant="h6">Update Driver Points</Typography>
      <TextField
        label="Driver Username"
        variant="outlined"
        value={driverUsername}
        onChange={handleUsernameChange}
        fullWidth
      />
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default PointChange;