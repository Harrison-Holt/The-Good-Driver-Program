import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import Navibar from "../../components/Navibar"
import SearchBar from "../../components/SearchBar"


const Applications: React.FC = () => {

    return (
        <>
            <Navibar/>
            <Box sx={{maxWidth: '95%', maxHeight:'95%', marginLeft: 'auto', marginRight: 'auto', marginTop:'10px'}}>
                <Stack spacing={2}>
                    <Stack direction={"row"} spacing={2}>
                        <Typography>Sponsor List:</Typography>
                        <Box sx={{width: '100%'}}>
                            <SearchBar/>
                        </Box>
                    </Stack>
                    <TextField
                        label={"Application Body"}
                        multiline
                        minRows={5}
                    />
                    <Stack direction={"row"} spacing={2}>
                        <Button>
                            Submit
                        </Button>
                        <Button>
                            Clear
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default Applications;