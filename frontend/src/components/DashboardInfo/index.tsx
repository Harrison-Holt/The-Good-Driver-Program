import React from 'react';
import SearchBar from '../../components/SearchBar';
import Catalog from '../Catalog/Catalog'; 
import { Box, Typography } from '@mui/material';

interface Props {
    currentDisplay: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>; // Add setSearchTerm as a prop
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, setSearchTerm }) => {
    let dashJsx = (
        <>
            <Typography variant='h6'>Home</Typography>
        </>
    );

    if (currentDisplay === "search") {
        dashJsx = (
            <>
                <Typography variant='h6'>Search</Typography>
                <SearchBar setSearchTerm={setSearchTerm} /> {/* Pass setSearchTerm */}
            </>
        );
    } else if (currentDisplay === "home") {
        dashJsx = (
            <>
                <Typography variant='h6'>Home</Typography>
            </>
        );
    } else if (currentDisplay === "notifications") {
        dashJsx = (
            <>
                <Typography variant='h6'>Notifications</Typography>
            </>
        );
    } else if (currentDisplay === "applications") {
        dashJsx = (
            <>
                <Typography variant='h6'>Applications</Typography>
            </>
        );
    } else if (currentDisplay === "catalog") {  // Add catalog display
        dashJsx = (
            <>
                <Typography variant='h6'>Catalog</Typography>
                <Catalog />  {/* Render the Catalog component */}
            </>
        );
    }

    return (
        <Box sx={{ width: '80%' }}>
            {dashJsx}
        </Box>
    );
};

export default DashboardInfo;

