import React from 'react';
import { Card, CardMedia, CardContent, Typography, Link } from '@mui/material';

interface CatalogItemProps {
  item: {
    itemId: string;
    title: string;
    image_url?: string; // Directly reference image_url
    price?: string;
    item_group_href?: string; // Use item_group_href if it represents the item URL
  };
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
  const { title, image_url, price, item_group_href } = item;

  return (
    <Card>
      {item_group_href ? (
        <Link href={item_group_href} target="_blank" rel="noopener">
          {image_url ? (
            <CardMedia
              component="img"
              height="140"
              image={image_url} // Use image_url directly from the API
              alt={title}
              style={{ objectFit: 'cover' }}
            />
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

        {price ? (
          <Typography variant="body2" color="text.secondary">
            Price: {price}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Price Not Available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default CatalogItem;
