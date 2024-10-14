import React from 'react';
import { EbayItem } from '../../types/EbayItem';  // Ensure the type is correctly imported

interface DashboardInfoProps {
  currentDisplay: string;
  catalogItems: EbayItem[];  // Expecting an array of EbayItem
}

const DashboardInfo: React.FC<DashboardInfoProps> = ({ currentDisplay, catalogItems }) => {
  return (
    <div>
      <h1>{currentDisplay}</h1>
      <ul>
        {catalogItems.length > 0 ? (
          catalogItems.map((item: EbayItem, index: number) => (
            <li key={index}>
              <a href={`https://www.ebay.com/itm/${item.itemId}`} target="_blank" rel="noopener noreferrer">
                {item.title} - {item.price.value} {item.price.currency}
              </a>
            </li>
          ))
        ) : (
          <p>No items found</p>
        )}
      </ul>
    </div>
  );
};

export default DashboardInfo;





