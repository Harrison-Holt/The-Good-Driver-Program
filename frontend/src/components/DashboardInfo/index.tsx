import SearchBar from '../../components/SearchBar';
import { Box, Typography } from '@mui/material';

interface Props {
    currentDisplay: string;
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay }) => {
    var dashJsx = (
        <>
            <Typography variant='h6'>Home</Typography>
        </>
    );

    if (currentDisplay === "search") {
        dashJsx = (
            <>
                <Typography variant='h6'>Search</Typography>
                <SearchBar/>
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
                <Typography variant='h6'>Applications</Typography>
            </>
        );
    } else if (currentDisplay === "applications") {
        dashJsx = (
            <>
                <Typography variant='h6'>Applications</Typography>
            </>
        );
    }

    return (
        <Box sx={{width: '80%'}}>
            {dashJsx}
        </Box>
    )
}

export default DashboardInfo;