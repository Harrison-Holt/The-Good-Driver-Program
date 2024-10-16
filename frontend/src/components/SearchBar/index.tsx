import { Autocomplete, TextField } from "@mui/material"

interface props {
    options: any
    label: string
}

const SearchBar: React.FC<props> = ({options, label}) => {
    //TODO: Add props for label and options
    return(
        <>
            <Autocomplete
                id="search-bar"
                freeSolo
                disableClearable
                options={options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
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