import { Autocomplete, TextField } from "@mui/material"

const SearchBar: React.FC = () => {
    return(
        <>
            <Autocomplete
                id="search-bar"
                freeSolo
                disableClearable
                options={["placeholder", "replace with real options"]}
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