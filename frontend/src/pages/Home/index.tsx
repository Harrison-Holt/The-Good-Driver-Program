import React, { useState, useEffect } from 'react';
import { Stack, Box, Divider, List, ListItem, ListItemButton } from '@mui/material';
import Navibar from '../../components/Navibar';
import DashboardInfo from '../../components/DashboardInfo';
import { fetchEbayItems } from '../../services/ebay_services';
import { EbayItem } from '../../types/EbayItem';  // Import the type for catalogItems

const Home: React.FC = () => {
  const [selectedDisplay, setSelectedDisplay] = useState<string>("home");
  const [catalogItems, setCatalogItems] = useState<EbayItem[]>([]);  // Ensure the correct type
  const accessToken = 'v^1.1#i^1#f^0#p^1#r^0#I^3#t^H4sIAAAAAAAAAOVYfWwURRS/a3uVT8EgFRRjWUCssN/3uXCH1w/oAe0V74S2VGBud65durd77szRXmLk0gSiTRPBGET+MKhBIhpCQ+I/pkaIikAIJkb+0Rj8SGyEBDEKGpE6e3ct10qgoRfTxMslu/PmzZv3+817M2+Hy5RPfXJ3/e7rM+33lRzMcJkSu52fzk0tdyy7v7TkYYeNK1CwH8wszpT1lA6uRCChJaWnIUoaOoKV3QlNR1JW6KdSpi4ZAKlI0kECIgnLUiTYsF4SGE5KmgY2ZEOjKkO1fsqneEWZ8wgyL7g9TkCE+rDJqOGneMjHlLjb6Y7LgPdwXtKPUAqGdISBjv2UwAlOmudoXozyXkkkfzKF4G2lKjdCE6mGTlQYjgpkvZWyY80CV+/sKUAImpgYoQKh4OpIOBiqrWuMrmQLbAXyNEQwwCk0ulVjKLByI9BS8M7ToKy2FEnJMkSIYgO5GUYblYLDztyD+zmm3W4PBwW30+sjLxwsCpWrDTMB8J39sCSqQsezqhLUsYrTd2OUsBHbDmWcbzUSE6HaSuuxIQU0Na5C00/VVQdbgk1NVKAemKaKDJ1W4A46Ut1My24SNLzoBHTMDWJukfPl58gZyjM8ZpIaQ1dUiy9U2WjgakgchmNpEQpoIUphPWwG49hypkBP4Ibp4/lWaz1zC5jCHbq1pDBBOKjMNu9O/shojE01lsJwxMLYjiw7fgokk6pCje3MhmE+crqRn+rAOCmxbFdXF9MlMobZzgocx7PNDesjcgdMkDwc1rVyXb37AFrNQpFJWHUjVcLpJPGlm4QpcUBvpwJOwecSXHneR7sVGCv9l6AAMzs6GYqVHILH43MrHiB7PGJMdInFSI5APj5Zyw8YA2k6AcxOiJMakCEtkzhLJaCpKpLoiguiNw5pxe2L005fPE7HXIqb5uMQchDGYrLP+z/JkfFGeQTKJsRFDPMihLgRAqyYMhprW5obgpHt3jDALayyLhSOVTduaPagHY3etBZ0NrEtIf94E+G24Gs0lTATJfMXmQAr1ydIQr2BMFQmBC8iG0nYZGiqnJ5cCyyaShMwcbo6lSbtCNQ08pgQ1GAyGSrmZl0EkOPfJ+4NcrHPp//8bLotKmTF7ORCZY1HxABIqox1+jCykWANQMoOS7TVyvWs1xPCrZKCdVKhJiBzaFUlV2kyWcgM2iEzJkRGyiRFNhO2qq+o0Ql1cqBh09A0aG7kJ5zKiUQKg5gGJ1tOFyHAVTDJTlveI3i9TqeHFyaES86epVsn25ZUxF2YCMq8462m2dFf9QFb9sf32M9wPfbPSux2rpaUb8u4qvLSZ8pKZ1BIxZBBQFdiRjejgjiD1HadfLWakOmE6SRQzZI5trPP2ZZnptWzx3rbepZFt6dtUwouFw4+y80buV6YWspPL7hr4Bbc6nHwsx6aKTh5jhd5r+gVhVZu0a3eMr6i7MGW8GZz3nLWnLZQOXV09toVl6fvP8HNHFGy2x22sh67jdXORvuG1LlfZW4eWXNuQejYlt/ezfQdqXrn5YrIJVzhWnX890822eQ97MJDFy93p7eG6m/0fPpi3YUpH7d+uGb+K8vfgqe+3XD66rqhtx1vXDP7SrYc9s/ukpcefrXrAk9LhqNqZ9u+Nweu9Hd8YGw7UrHId15y1Oz/ZfVrjzJnFvc/deDn2p+2bV57KfDY0lmLvos+4Fvx+ZBr3rGL7z3/xJe7bqyrOj3gHzz0R3/v0bVL6vQZl65cxV88kt418Pr18PmBsy/1d/791x442HvyoxM//Dhnk9JWHjl0befQ8V9P7vlzb/Qb7lzb49/fXL9q7wuO2V832W68T08Jn5FR7+bBJQfmu819pQ1z5fbcmv4De1hzMvYRAAA=';  // Replace with your access token

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
          {/* Explicitly cast the props to ensure TypeScript understands the type */}
          <DashboardInfo currentDisplay={selectedDisplay} catalogItems={catalogItems as EbayItem[]} />
        </Stack>
      </Box>
    </>
  );
};

export default Home;

