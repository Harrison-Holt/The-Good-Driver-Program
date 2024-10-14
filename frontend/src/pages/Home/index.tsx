import React, { useState, useEffect } from 'react';
import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import DashboardInfo from '../../components/DashboardInfo';
import { fetchEbayItems } from '../../services/ebay_services';
import { EbayItem } from '../../types/EbayItem';  // Import the type for catalogItems

const Home: React.FC = () => {
  const [selectedDisplay, setSelectedDisplay] = useState<string>("home");
  const [catalogItems, setCatalogItems] = useState<EbayItem[]>([]);  // Ensure the correct type
  const accessToken = 'v^1.1...';  // Replace with your valid access token

  // Fetch eBay catalog items immediately when the component loads
  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchEbayItems(accessToken, 'laptop');
      setCatalogItems(items);
    };
    fetchItems();
  }, []);  // Empty dependency array means this runs once when the component mounts

  const dashboardList = (
    <Box>
      <List>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("home")}>
            Home
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("notifications")}>
            Notifications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("search")}>
            Search
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("applications")}>
            Applications
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setSelectedDisplay("profile")}>
            Profile
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Box>
        <Navibar />
        <Stack direction={"row"} spacing={5}>
          {dashboardList}
          <Divider orientation='vertical' variant='middle' flexItem />
          {/* Explicitly cast the props to ensure TypeScript understands the types */}
          <DashboardInfo currentDisplay={selectedDisplay} catalogItems={catalogItems as EbayItem[]} />
        </Stack>

        {/* Render the fetched eBay items */}
        {catalogItems.length > 0 ? (
          <ul>
            {catalogItems.map((item: EbayItem, index: number) => (
              <li key={index}>
                <a href={`https://www.ebay.com/itm/${item.itemId}`} target="_blank" rel="noopener noreferrer">
                  {item.title} - {item.price.value} {item.price.currency}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found</p>
        )}
      </Box>
    </>
  );
};

export default Home;



