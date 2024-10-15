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
  
  const CatalogItem = ({ item }: CatalogItemProps) => {
    return (
      <div className="catalog-item">
        <img src={item.image.imageUrl} alt={item.title} />
        <h3>{item.title}</h3>
        <p>{item.price.currency} {item.price.value}</p>
        <a href={item.itemWebUrl} target="_blank" rel="noopener noreferrer">View Item</a>
      </div>
    );
  };
  
  export default CatalogItem;
  

