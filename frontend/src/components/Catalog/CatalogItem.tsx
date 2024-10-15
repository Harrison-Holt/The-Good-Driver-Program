import React from 'react';
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

interface CatalogItemProps {
  item: EbayItem;
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
  return (
    <div className="catalog-item">
      <img src={item.image.imageUrl} alt={item.title} className="catalog-item-image" />
      <h3 className="catalog-item-title">{item.title}</h3>
      <p className="catalog-item-price">
        {item.price.currency} {item.price.value}
      </p>
      <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">
        <button className="purchase-button">Purchase</button>
      </a>
    </div>
  );
};

export default CatalogItem;


