import React from 'react';
import { Box } from '@mui/material';
import { EbayItem } from '../../types/EbayItem';  // Ensure the type is correctly imported

// Define Props interface
interface Props {
  currentDisplay: string;
  catalogItems: EbayItem[];  // Define catalogItems as an array of EbayItem
}

const DashboardInfo: React.FC<Props> = ({ currentDisplay, catalogItems }) => {
  if (currentDisplay === 'search' && catalogItems.length > 0) {
    return (
      <Box>
        <h2>Search Results</h2>
        <ul>
          {catalogItems.map((item) => (
            <li key={item.itemId}>
              <h3>{item.title}</h3>
              <img src={item.image.imageUrl} alt={item.title} width={150} />
              <p>Price: {item.price.value} {item.price.currency}</p>
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  return <p>No content to display.</p>;
};

export default DashboardInfo;




