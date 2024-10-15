import { useState, useEffect } from 'react';
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';

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
  // State for catalog items
  const [items, setItems] = useState<EbayItem[]>([]);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for loading status
  const [loading, setLoading] = useState(false);

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/catalog`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer v^1.1#i^1#f^0#p^1#r^0#I^3#t^...`,  
              'Content-Type': 'application/json',
            },
        }); 
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        setItems(data.itemSummaries || []);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching items', error);
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, [searchTerm]);

  return (
    <div>
      <SearchBar setSearchTerm={setSearchTerm} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <div className="catalog-grid">
        {items.map((item) => (
          <CatalogItem key={item.itemId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;

