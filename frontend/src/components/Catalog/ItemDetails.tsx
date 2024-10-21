import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

// Define the ItemDetails interface based on your expected API response
interface ItemDetails {
    itemId: string;
    title: string;
    image: {
        imageUrl: string;
        width: number;
        height: number;
    };
    price: {
        value: string;
        currency: string;
    };
    description: string;
    // Add other properties based on your actual response
}

const ItemDetailsComponent = () => {
    const { itemId } = useParams(); // Get itemId from URL parameters
    const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null); // Use the defined interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Explicitly declare the type

    useEffect(() => {
        const fetchItemDetails = async () => {
            console.log("Fetching details for item ID:", itemId); // Log itemId being fetched
            try {
                const response = await fetch(`https://ph2fd5spla.execute-api.us-east-1.amazonaws.com/prod/item_details?itemId=${itemId}`);
                
                console.log('Response Status:', response.status); // Log the response status

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: ItemDetails = await response.json(); // Specify the type here
                console.log('Fetched item details:', data); // Log the fetched item details
                setItemDetails(data);
            } catch (error) {
                // Check if error is an instance of Error and set the error message accordingly
                if (error instanceof Error) {
                    console.error('Error fetching item details:', error.message); // Log any errors
                    setError(error.message);
                } else {
                    console.error('An unexpected error occurred:', error); // Log unexpected errors
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [itemId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                Error: {error}
            </Typography>
        );
    }

    if (!itemDetails) {
        return (
            <Typography align="center">
                No item details found.
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4">{itemDetails.title}</Typography>
            <img src={itemDetails.image.imageUrl} alt={itemDetails.title} />
            <Typography variant="h6">Price: {itemDetails.price.value} {itemDetails.price.currency}</Typography>
            <Typography variant="body1">Description: {itemDetails.description}</Typography>
            {/* Add more item details as needed */}
        </Box>
    );
};

export default ItemDetailsComponent;

