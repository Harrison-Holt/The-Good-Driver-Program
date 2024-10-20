import React from 'react';
import { Card, CardMedia, CardContent, Typography, Link } from '@mui/material';

interface CatalogItemProps {
  item: {
    itemId: string;
    title: string;
    image?: { imageUrl?: string };
    price?: { value: string; currency: string } | string;
    itemWebUrl?: string;
  };
}

const CatalogItem: React.FC<CatalogItemProps> = ({ item }) => {
  const { title, image, price, itemWebUrl } = item;

  // Check the image URL to verify it's correct
  console.log("Image URL:", image?.imageUrl);

  return (
    <Card>
      {itemWebUrl ? (
        <Link href={itemWebUrl} target="_blank" rel="noopener">
          {image?.imageUrl ? (
            <CardMedia
              component="img"
              height="140"
              image={image.imageUrl}
              alt={title}
              style={{ objectFit: 'cover' }} // Ensuring the image fits correctly
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
          {itemWebUrl ? (
            <Link href={itemWebUrl} target="_blank" rel="noopener">
              {title}
            </Link>
          ) : (
            <Typography>{title}</Typography>
          )}
        </Typography>

        {typeof price === 'object' && price?.value && price?.currency ? (
          <Typography variant="body2" color="text.secondary">
            Price: {price.value} {price.currency}
          </Typography>
        ) : typeof price === 'string' ? (
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
