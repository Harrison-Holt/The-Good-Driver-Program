import { useState, useEffect } from 'react';
import CatalogItem from './CatalogItem';
import SearchBar from '../SearchBar';
import './catalog.css';

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

// Define the categories with corresponding eBay category IDs
const categories = [
  { id: '6030', name: 'Fashion' },
  { id: '293', name: 'Electronics' },
  { id: '267', name: 'Home & Garden' },
  { id: '171485', name: 'Health & Beauty' },
  { id: '888', name: 'Sports & Outdoors' },
];

const Catalog = () => {
  // State for catalog items
  const [items, setItems] = useState<EbayItem[]>([]);
  
  // State for selected category
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

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
        // Call your API Gateway with the selected category and search term
        const response = await fetch(`https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev/catalog?category=${selectedCategory}&q=${searchTerm}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        }); 
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setItems(data.itemSummaries || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, [selectedCategory, searchTerm]); // Fetch when the category or search term changes

  return (
    <div>
      {/* Search Bar */}
      <SearchBar setSearchTerm={setSearchTerm} />

      {/* Category Selection */}
      <div className="category-bar">
        <label htmlFor="category">Select Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

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

