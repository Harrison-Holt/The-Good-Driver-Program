export interface EbayItem {
    itemId: string;
    title: string;
    image: {
      imageUrl: string;
    };
    price: {
      value: string;
      currency: string;
    };
  }
  