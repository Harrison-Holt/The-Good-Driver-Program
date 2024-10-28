import React from 'react';
import { Autocomplete, TextField } from "@mui/material";

interface SearchBarProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  label: string
  options: string[]; // Add a prop for the options
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, label, options }) => {
  return (
    <Autocomplete
      id="search-bar"
      freeSolo
      disableClearable
      options={options} // Use dynamic options passed as props
      onInputChange={(_, value) => setSearchTerm(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: 'search',
          }}
        />
      )}
    />
  );
};

export default SearchBar;


