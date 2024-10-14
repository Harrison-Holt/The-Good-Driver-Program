import { useState, useEffect } from 'react';
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar/index';

// Define the type for an Ebay item
interface EbayItem {
  itemId: string;
  title: string;
  image: {
    imageUrl: string;
  };
  price: {
    value: string;
    currency: string;
  };
  itemWebUrl: string;
}

const Catalog = () => {
  // Type the state to be an array of EbayItem
  const [items, setItems] = useState<EbayItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${searchTerm}`, {
          headers: {
            'Authorization': `Bearer v^1.1#i^1#f^0#p^1#r^0#I^3#t^H4sIAAAAAAAAAOVYbWwURRjutdcKFjCmBAyKnKvR0Hr7dd8Ld+Xa0vSkX3ClaauEzu7Otnvd273uzLU9UHIWJYYmtSYSTDBaENAfGonBBMWQgEgIhIiggRAwQROFYPyBQTGExNnrB9dKoKEX08RLLpuZeeed53nmfWfeXTZdNLt0S82Wv+baHsofTrPpfJuNK2ZnFxWWzSvIX1SYx2YZ2IbTz6Tt/QVXliMQ1xLCGogSho6goy+u6UjIdAappKkLBkAqEnQQh0jAkhAN19UKPM0KCdPAhmRolCNSFaT8bpefV1jy9/CKCFykVx/z2WQEKcknAlbieS8PJMUjcWQcoSSM6AgDHQcpnuXdTo51cu4mnhM4j8AFaJff10Y5mqGJVEMnJjRLhTJwhcxcMwvrvaEChKCJiRMqFAlXRxvCkaqV9U3LmSxfoVEdohjgJJrYqjRk6GgGWhLeexmUsRaiSUmCCFFMaGSFiU6F8BiYB4CfkVr0eSBwc9DnYd1QFPmcSFltmHGA743D6lFlp5IxFaCOVZy6n6JEDTEGJTzaqicuIlUO67E6CTRVUaEZpFZWhFvDjY1UqAaYpooM3SnDHme0osUpeWXFy7ncwCl6geh1sYHRNUYcjSo8aZFKQ5dVSy/kqDdwBSSA4WRZ2CxZiFGD3mCGFWyBybZzjcnnC7RZ+zmygUncqVtbCuNEA0emeX/xx2djbKpiEsNxD5MHMuoEKZBIqDI1eTAThqOR04eCVCfGCYFhent76V4XbZgdDM+yHNNSVxuVOmEcUGO2Vq4j9f4TnGqGigTJTKQKOJUgWPpImBIAegcVcvMBD+8Z1X0irNDk3n91ZHFmJiZDrpLDxwIx4Ia+AHDJnMcl5yI5QqPxyVg4oAhSzjgwuyBOaECCTonEWTIOTVUWXB6Fd/kV6JS9AcXpDiiKU/TIXienQMhCkqtSwP8/yZGpRnkUSibEuQvzXIS4EQGMK2nUV7W21IWjMX8DwK2MvCrSIFbUr27xoZ56f0oLuxuZ1khwqolwV/KVmkqUaSLr51YAK9enK0KNgTCUp0UvKhkJ2GhoqpSaWRvsMuVGYOJURTJF2lGoaeQxLarhRCKSw8M6FySnfk48GOUc30///d10V1bIitmZxcqaj4gDkFBp6/ahJSPOGICUHVaXlevrM6inxVslBeuMYk1IjrBV5ZFKk85QplGPRJsQGUmTFNl0g1V9NRldUCcXGjYNTYNmMzftVI7HkxiIGpxpOZ2DAFfBDLttOR/vD7hZDze940jK3KXrZ9qRlMNTmEH2wJSraWbia30oL/Pj+m0n2H7bsXybja0i5VsZu7SoYK29YA6FVAxpBHRZNPpoFSg0Ujt08tZqQroLphJANfNL8k525z2ffriG2bf1pf6yplgqb1bW14Xhdexj498XZhdwxVkfG9gn7owUco8snMu7OZZz8xxHtr2NffrOqJ1bYJ9/zFM6WM3BoaYFx1cPrDm10OxJfc3OHTey2Qrz7P22vOaPr27dMytyZv8Xu9Mntl7uX7zug/MX5F9O7OgffLP7SWn4rVu7b55tm/eD8eq7R1r0RZuH6pfUffR7e0nl/jcOXV1R81MJbhy8ffqK9OuhDYcXvlO1duel9g/Z2OX5X168JIVhd6Rkzud7z8Keaxcr93zzx3aH92Csanep5LlRrRRfd5drzx5Lnd5zrnFj8McLb+8qOHqqr3aD5wi6tmTwfOcVsKPriHHSvq12RbziszMvtMN987idf3d/Wv7dJ68VLxs6uvH2wFN/Hn7/0e9jm2Ll6d/mnH1u7Xvblg0cv5Bsf7loMX3g2/SqW9fXbC7bdGtX6eu9A3up+TePHlzX8aJwTig/sPSV8Pavfr7x+Mie/gOQpY8g9xEAAA==`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        // If data contains itemSummaries, update the state, otherwise set an empty array
        setItems(data.itemSummaries || []);
      } catch (error) {
        console.error('Error fetching items', error);
      }
    };

    if (searchTerm) {
      fetchItems();
    }
  }, [searchTerm]);

  return (
    <div>
      <SearchBar setSearchTerm={setSearchTerm} />
      <div className="catalog-grid">
        {items.map((item) => (
          <CatalogItem key={item.itemId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;

