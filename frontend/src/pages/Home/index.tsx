
import { Stack, Typography, Box, Divider } from '@mui/material';
import Navibar from '../../components/Navibar';
import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <Box>
        <Navibar />
        <Stack direction={"row"} spacing={5}>
          <Stack spacing={2}>
            <Typography variant='h5'>List of Dashboard items</Typography>
            <Typography variant='h5'>Points</Typography>
            <Typography variant='h5'>Profile</Typography>
            <Typography variant='h5'>Applications</Typography>
          </Stack>
          <Divider orientation='vertical' variant='middle' flexItem/>
          <Stack spacing={2}>
            <Typography>Content Display area</Typography>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default Home;

