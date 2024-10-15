import { Autocomplete, TextField } from "@mui/material"

const SearchBar: React.FC = () => {
    //TODO: Add props for label and options
    return(
        <>
            <Autocomplete
                id="search-bar"
                freeSolo
                disableClearable
                options={["placeholder", "replace with real options", 'item']}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search input"
                        slotProps={{
                        input: {
                            ...params.InputProps,
                            type: 'search',
                        },
                        }}
                    />
                )}
            />
        </>
    )
}

export default SearchBar;