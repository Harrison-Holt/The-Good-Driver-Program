import React from 'react';
import { Card, CardContent, Typography, Link } from '@mui/material';

interface CatalogItemProps {
  item: {
    itemId: string;
    title: string;
    image_url?: string; // Directly reference image_url
    price?: string | { value: string; currency: string }; // Handle both string and object
    item_group_href?: string; // Use item_group_href if it represents the item URL
  };
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
  const { title, image_url, price, item_group_href } = item;

  // Log the image_url for debugging
  console.log("Image URL:", image_url);
  console.log("Item Object:", item);


  const renderPrice = () => {
    if (typeof price === 'string') {
      return `Price: ${price}`;
    }
    if (typeof price === 'object' && price?.value && price?.currency) {
      return `Price: ${price.value} ${price.currency}`;
    }
    return 'Price Not Available';
  };

  return (
    <Card>
      {item_group_href ? (
        <Link href={item_group_href} target="_blank" rel="noopener">
          {image_url ? (
            <>
              {/* Log image_url here */}
              <img
  src={item.image_url}
  alt={item.title}
  style={{ width: '100%', height: 'auto' }} // Full width and auto height for testing
/>

            </>
          ) : (
            <Typography>No Image Available</Typography>
          )}
        </Link>
      ) : (
        <Typography>No URL Available</Typography>
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {item_group_href ? (
            <Link href={item_group_href} target="_blank" rel="noopener">
              {title}
            </Link>
          ) : (
            <Typography>{title}</Typography>
          )}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {renderPrice()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CatalogItem;
