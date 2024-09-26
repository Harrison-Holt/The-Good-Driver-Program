
import { Typography } from '@mui/material';
import Navibar from '../../components/Navibar';
import React from 'react';

const Home: React.FC = () => {
  return (
    <>
      <Navibar />
      <Typography component={"h1"}>Dashboard</Typography>
    </>
  );
};

export default Home;

