import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Define an interface for the item details structure
interface ItemDetails {
    title: string;
    image: {
        imageUrl: string;
    };
    price: {
        value: string;
        currency: string;
    };
}

const ItemDetailsComponent = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [itemDetails, setItemDetails] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            if (!itemId) {
                setError("Item ID is required");
                setLoading(false);
                return;
            }

            const decodedItemId = decodeURIComponent(itemId);
            try {
                const response = await fetch(`https://ph2fd5spla.execute-api.us-east-1.amazonaws.com/prod/item_details?itemId=${decodedItemId}`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }

                const data: ItemDetails = await response.json(); // Use the defined interface for the response
                setItemDetails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [itemId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{itemDetails?.title}</h1>
            <img src={itemDetails?.image.imageUrl} alt={itemDetails?.title} />
            <p>Price: {itemDetails?.price.value} {itemDetails?.price.currency}</p>
            {/* Render additional details as needed */}
        </div>
    );
};

export default ItemDetailsComponent;
