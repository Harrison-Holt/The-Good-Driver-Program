import React from 'react';

interface CatalogItemProps {
    item: {
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
    };
  }
  
const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
  return (
    <div className="catalog-item">
      <img src={item.image.imageUrl} alt={item.title} />
      <h2>{item.title}</h2>
      <p>{item.price.value} {item.price.currency}</p>
      <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">
        View on eBay
      </a>
    </div>
  );
};

export default CatalogItem;

