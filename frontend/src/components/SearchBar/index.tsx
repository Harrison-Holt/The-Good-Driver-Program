import React from 'react';
import { Autocomplete, Paper, TextField } from "@mui/material";
import { useSettings } from '../Settings/settings_context';

type stringParamFunction = (a: string) => any

interface SearchBarProps {
  setSearchTerm: stringParamFunction;
  label: string
  options: string[]; // Add a prop for the options
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, label, options }) => {
  const { settings } = useSettings(); // Access settings, including high contrast mode

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
      PaperComponent={(props) => (
        <Paper
          {...props}
          sx={{
            backgroundColor: settings.isHighContrast
                ? "black"
                : settings.isDarkMode || settings.isGreyscale
                ? "gray"
                : "#ffffff", // Same background logic as sidebarNavList
            color: settings.isHighContrast
                ? "white"
                : settings.isDarkMode || settings.isGreyscale
                ? "white"
                : "black",
          }}
        />
      )}
    />
  );
};

export default SearchBar;


