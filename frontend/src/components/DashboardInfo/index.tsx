import React from 'react';
import SearchBar from '../../components/SearchBar';
import Catalog from '../Catalog/Catalog';
import { Box, Typography } from '@mui/material';

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
                    <SearchBar setSearchTerm={setSearchTerm} options={[]} /> {/* Ensure the 'options' prop is passed */}
                </>
            );
            break;

        case "home":
            dashJsx = (
                <>
                    <Typography variant='h6'>Home</Typography>
                </>
            );
            break;

        case "notifications":
            dashJsx = (
                <>
                    <Typography variant='h6'>Notifications</Typography>
                </>
            );
            break;

        case "applications":
            dashJsx = (
                <>
                    <Typography variant='h6'>Applications</Typography>
                </>
            );
            break;

        case "catalog":
            dashJsx = (
                <>
                    <Typography variant='h6'>Catalog</Typography>
                    <Catalog />  {/* Render the Catalog component */}
                </>
            );
            break;

        default:
            dashJsx = (
                <>
                    <Typography variant='h6'>Home</Typography>
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

