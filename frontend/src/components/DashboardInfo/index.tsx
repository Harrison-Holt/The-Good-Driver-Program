import React from 'react';
import { useAppSelector } from '../../store/hooks'; // Import the selector hook from your store
import Applications from '../Applications';
import SearchBar from '../../components/SearchBar';
import { Box, Typography } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart';
import PointChange from '../PointChange.tsx';
import Profile from '../Profile';
import PointHistory from '../PointHistory';
import { selectUserName } from '../../store/userSlice'; // Import the selector for username

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  // Retrieve the logged-in username from global state
  const username = useAppSelector(selectUserName);

  let dashJsx;

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
        dashJsx = (
          <>
            <Typography variant="h6">Point History</Typography>
            {username && <PointHistory driverUsername={username} />} {/* Render only if username exists */}
          </>
        );
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
