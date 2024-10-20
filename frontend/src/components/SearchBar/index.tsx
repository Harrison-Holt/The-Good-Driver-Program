import React from 'react';
import { Autocomplete, TextField } from "@mui/material";

interface SearchBarProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  options: string[]; // Add a prop for the options
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, options }) => {
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
          label="Search Catalog"
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


