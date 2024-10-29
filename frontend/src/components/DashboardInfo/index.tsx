import React from 'react';
import Applications from '../Applications';
import SearchBar from '../../components/SearchBar';
import { Box, Typography } from '@mui/material';
import Catalog from '../Catalog/Catalog';
import Cart from '../Catalog/Cart'; // Assuming Cart is imported here
import PointChange from '../PointChange.tsx';

interface Props {
  currentDisplay: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>; // Add setSearchTerm as a prop
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
  let dashJsx;

    switch (currentDisplay) {
        case "search":
            dashJsx = (
                <>
                    <Typography variant='h6'>Search</Typography>
                    <SearchBar setSearchTerm={setSearchTerm} label='search' options={[]} /> {/* Ensure the 'options' prop is passed */}
                </>
            );
            break;

        case "cart":
        dashJsx = (
            <>
            <Typography variant="h6">Your Cart</Typography>
            <Cart /> {/* Render the Cart component */}
            </>
        );
        break;

        case "catalog":
        dashJsx = (
            <>
            <Typography variant="h6">Catalog</Typography>
            <Catalog /> {/* Render the Catalog component */}
            </>
        );
        break;

        case "applications":
            dashJsx = (
                <>
                    <Typography variant='h6'>Applications</Typography>
                    <Applications/>
                </>
            );
        break;

        // Adding new "pointChange" case in the switch
        case "pointChange":
            dashJsx = (
                <>
                    <Typography variant="h6">Point Change</Typography>
                    <PointChange /> {/* Create and import this component */}
                </>
        );break;
  

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
