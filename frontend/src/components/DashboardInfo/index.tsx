import React, { useState } from 'react';
import Applications from '../Applications';
import SearchBar from '../../components/SearchBar';
import { Box, Typography, TextField, Button } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart';
import PointChange from '../PointChange.tsx';
import Profile from '../Profile';
import PointHistory from '../PointHistory';

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  const [driverUsername, setDriverUsername] = useState<string>(''); // State to hold the driver's username
  let dashJsx;

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDriverUsername(event.target.value);
  };

  const renderPointHistory = () => (
    <>
      <Typography variant="h6">Point History</Typography>
      <TextField
        label="Driver Username"
        variant="outlined"
        value={driverUsername}
        onChange={handleUsernameChange}
        fullWidth
        sx={{ marginBottom: '16px' }}
      />
      <Button variant="contained" color="primary" onClick={() => setDriverUsername(driverUsername)}>
        View Point History
      </Button>
      {driverUsername && <PointHistory driverUsername={driverUsername} />}
    </>
  );

  switch (currentDisplay) {
    case "search":
      dashJsx = (
        <>
          <Typography variant='h6'>Search</Typography>
          <SearchBar setSearchTerm={setSearchTerm} label='search' options={[]} />
        </>
      );
      break;

    case "cart":
      dashJsx = (
        <>
          <Typography variant="h6">Your Cart</Typography>
          <Cart />
        </>
      );
      break;

    case "catalog":
      dashJsx = (
        <>
          <Typography variant="h6">Catalog</Typography>
          <Catalog />
        </>
      );
      break;

    case "applications":
      dashJsx = (
        <>
          <Typography variant='h6'>Applications</Typography>
          <Applications />
        </>
      );
      break;

    case "pointChange":
      dashJsx = (
        <>
          <Typography variant="h6">Point Change</Typography>
          <PointChange />
        </>
      );
      break;

    case "pointHistory":
      dashJsx = renderPointHistory();
      break;

    case "profile":
      dashJsx = (
        <>
          <Typography variant="h6">Profile</Typography>
          <Profile />
        </>
      );
      break;

    default:
      dashJsx = (
        <>
          <Typography variant="h6">Home</Typography>
        </>
      );
      break;
  }

  return (
    <Box sx={{ width: '80%', padding: '20px' }}>
      {dashJsx}
    </Box>
  );
};

export default DashboardInfo;
