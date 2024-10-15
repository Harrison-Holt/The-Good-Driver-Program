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
        const response = await fetch(`https://nib1kxgh81.execute-api.us-east-1.amazonaws.com/dev`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer v^1.1#i^1#f^0#p^1#r^0#I^3#t^H4sIAAAAAAAAAOVYfWgURxS/Sy7a+BW0WiVaeq61H8a9m927Te625uLlLjGnJhdzZxojJczuzsY1e7uXnT2Ta6TEKKm1SqXEShFUAi3SUChV2yJopZQKih9EoVBbaWn/8I9I0KKxtNjubS7xkooGc5RA959l37x5836/997M2wGd0/JXdFd1D822Ts852gk6c6xWaibIn5ZXNCc3pzDPAjIUrEc7X+y0deXeXIVhTI6zdQjHVQUje3tMVjBrCkuJhKawKsQSZhUYQ5jVeTbir17P0g7AxjVVV3lVJuyhYClRLCDBK3oFgXdDQFGcIVVGbEbVUsINkZunOU7wekXAuL3GOMYJFFKwDhW9lKAB7SYpQFJMFFAsoFmGdrhoqpGw1yMNS6piqDgA4TPdZc25Woavj3cVYow03TBC+EL+ykjYHwpW1ERXOTNs+dI8RHSoJ/DYr4AqIHs9lBPo8ctgU5uNJHgeYUw4fcMrjDXK+keceQr3TaohKqEFxHndXshRiBKyQmWlqsWg/ng/UhJJIEVTlUWKLunJJzFqsMFtRbye/qoxTISC9tRrQwLKkighrZSoKPdv8tfWEr4qqGkSVhVSQNvI2rogyRQLHE8LgkiKTIm3mGP49BrDhtIMj1skoCqClOIL22tUvRwZDqOxtACDk4e0GEphJaz5RT3lTKaea4Q+4G5MxXM4gAl9i5IKKYoZHNjNzyeTPzpb1zWJS+ho1ML4AZMdI8zxuCQQ4wfNNExnTjsuJbboepx1Otva2hxtLoeqNTtpAChnQ/X6CL8FxSAxopuqdSw9eQIpmVB4ZMzEEqsn44Yv7UaaGg4ozYSPAYzHU5zmfaxbvvHSfwkyMDvHFkO2ikNwuTw87fYgwQgEQ8FsFIcvnZ/OlB+Ig0kyBrUWpMdlyCOSN/IsEUOaJLAuRqRdHhGRQrFXJN1eUSQ5RigmKREhgBDH8V7P/6RGJprlEcRrSM9emmcjxSPVrd6qrQ3rKotcW6UGV3s45G6WKqpatm3S164JR9yBto2JaKKhUausKJ1oITwSfECWDGaixvrZJSBV65MloUrFOhImBS/Cq3FUq8oSn5xaAXZpQi3U9GQEybIhmBRIfzweyuI2nQ14E98hng5ylk+m//5UeiQqnMrWqYUqNR8bBmBccqTOHQevxpwqNBqOlKjJ9Njs4SeDWzJa1SmF2gA5jFYShntMhwnZgbfxDg1hNaEZ7bUjnOq7omoLUoyjTNdUWUZaPTXpUo7FEjrkZDTVajoLCS7BKXbOUiW0x8u4jdekcPHmKdo01bakLO7CIwKbawJ9tHPsD73PYj5Ul/Ub0GU9k2O1glVgObUMLJ2Wu9GWO6sQSzpySFB0YKlZMf5TNeRoQck4lLScZy13eg9UBQorwh+s6Igmrxw6Z5mVcZ9w9A2waPRGIT+XmplxvQCWPBzJowoWzqbdFKAYQAGaoRvBsoejNuo52/z+N9X7TQs6mj/6+fJA66cLA5aefA+YPapkteZZbF1WS6dt/qVg38GrvfPf8126uXpH75+vhz6ed/yI849d1xu/vXK+cH/PwKnBJVdvfbX09gJqX/uX+4eaGmcUUXv2ar+BBzvxj/cP11UPFfzQ/8XzR1qZY5vPbr94q2Tlxc0n3jodfH/6sbL+3Gue7/4KrrueZ993Ge7pmXGn7Nq8VwrkDfmvLX43VnOm6FDF4e/nOF+60bds4O977wjVJYEH3cLATwfPvPxL3zPHT+COeu6TC3M/3/5r2fJz8d/bzg/6dq6oXr3hVFHr4iUz6hbN2jl0el5/3+637+66G1Ln3rtB7l/z6oGm3pN7zgZ9h8tODh772gJ7ym/fX1lQPrhubXfH7f65cO+Hvhfad9z8TNt4YTiW/wA7G4Lp6REAAA==`,  
              'Content-Type': 'application/json',
            },
        }); 
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
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
  
    // Only fetch items if there is a search term or some condition you set
    fetchItems();
  }, [searchTerm]);

  return (
    <div>
      {/* Search bar allows the user to update the search term */}
      <SearchBar setSearchTerm={setSearchTerm} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <div className="catalog-grid">
        {/* Display catalog items */}
        {items.map((item) => (
          <CatalogItem key={item.itemId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;

