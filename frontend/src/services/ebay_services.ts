import axios from 'axios';

export const fetchEbayItems = async (accessToken: string, searchTerm: string = 'laptop') => {
    try {
      const response = await axios.get('https://cors-anywhere.herokuapp.com/https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Origin': 'http://localhost:5173',  // Replace with your actual origin if necessary
          'x-requested-with': 'XMLHttpRequest',
        },
        params: {
          q: searchTerm,
          limit: 10,
        },
      });
      return response.data.itemSummaries || [];
    } catch (error) {
      console.error('Error fetching eBay items:', error.message);
      return [];
    }
  };
  
