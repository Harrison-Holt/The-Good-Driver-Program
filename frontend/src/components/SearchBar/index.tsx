import React from 'react';
import { Autocomplete, TextField } from "@mui/material";

interface SearchBarProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm }) => {
  return (
    <Autocomplete
      id="search-bar"
      freeSolo
      disableClearable
      options={["placeholder", "replace with real options", 'item']}
      onInputChange={(_, value) => setSearchTerm(value)} 
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search input"
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


