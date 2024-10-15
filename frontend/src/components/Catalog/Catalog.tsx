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
  { id: '11450', name: 'Clothing, Shoes & Accessories' },
  { id: '58058', name: 'Cell Phones & Accessories' },
  { id: '267', name: 'Books' },
  { id: '888', name: 'Sporting Goods' },
  { id: '26395', name: 'Health & Beauty' },
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
    <div className="catalog-container">
      {/* Search Bar */}
      <SearchBar setSearchTerm={setSearchTerm} options={categories.map(cat => cat.name)} />

      {/* Category Selection */}
      <div className="category-bar">
        <label htmlFor="category" className="category-label">Select Category: </label>
        <select
          id="category"
          className="category-select"
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

      {/* Loading and Error Messages */}
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {/* Catalog Grid */}
      <div className="catalog-grid">
        {items.map((item) => (
          <CatalogItem key={item.itemId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;

