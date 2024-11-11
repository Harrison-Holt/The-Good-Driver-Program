/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Alert,
  Button,
  useTheme,
} from "@mui/material";

interface Catalog {
  id: string;
  name: string;
  description: string;
}

interface ItunesItem {
  trackId?: string;
  collectionId?: string;
  trackName?: string;
  collectionName?: string;
  artistName: string;
  artworkUrl100: string;
  collectionPrice?: number;
  currency?: string;
}

const API_BASE_URL = "https://itunes.apple.com/search";

// Predefined catalogs that sponsors can select from
const predefinedCatalogs: Catalog[] = [
  { id: "music-catalog", name: "Music Catalog", description: "Popular music tracks" },
  { id: "podcast-catalog", name: "Podcast Catalog", description: "Trending podcasts" },
  { id: "tv-show-catalog", name: "TV Show Catalog", description: "Top-rated TV shows" },
  { id: "movie-catalog", name: "Movie Catalog", description: "Blockbuster movies" },
  { id: "software-catalog", name: "Software Catalog", description: "Essential software" },
];

const Catalog = () => {
  const [items, setItems] = useState<ItunesItem[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null); // Selected catalog for sponsors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  // Fetch items for the selected catalog
  useEffect(() => {
    if (!selectedCatalog) return; // Skip fetch if no catalog is selected
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE_URL}?term=${encodeURIComponent(
          selectedCatalog.name.split(" ")[0]
        )}&limit=50`; // Search based on catalog name
        const response = await fetch(url);
        const data = await response.json();
        setItems(data.results || []);
      } catch (error) {
        setError("Failed to fetch items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selectedCatalog]);

  const handleCatalogSelection = (catalogId: string) => {
    const catalog = predefinedCatalogs.find((c) => c.id === catalogId);
    setSelectedCatalog(catalog || null); // Update the selected catalog
  };

  return (
    <Box
      sx={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: theme.palette.background.default,
      }}
    >
    <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
  Select a Catalog
</Typography>


      
        <Box sx={{ marginBottom: "20px" }}>
          <Typography variant="h6">Choose a Catalog:</Typography>
          <Select
            value={selectedCatalog?.id || ""}
            onChange={(e) => handleCatalogSelection(e.target.value)} // Handle catalog selection
            fullWidth
          >
            {predefinedCatalogs.map((catalog) => (
              <MenuItem key={catalog.id} value={catalog.id}>
                {catalog.name}
              </MenuItem>
            ))}
          </Select>
          {selectedCatalog && (
            <Typography variant="body2" sx={{ marginTop: "10px", fontStyle: "italic" }}>
              {selectedCatalog.description} {/* Show catalog description */}
            </Typography>
          )}
        </Box>
      

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", margin: "20px" }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ margin: "20px 0" }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {!loading && items.length === 0 && !error && selectedCatalog && (
        <Typography align="center" sx={{ margin: "20px 0" }}>
          No items found for {selectedCatalog.name}.
        </Typography>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.trackId || item.collectionId}>
            <Box
              sx={{
                border: "1px solid #ddd",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <img
                src={item.artworkUrl100}
                alt={item.trackName || item.collectionName}
                style={{ width: "100%", borderRadius: "4px" }}
              />
              <Typography variant="h6" sx={{ marginTop: "10px" }}>
                {item.trackName || item.collectionName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item.artistName}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: "10px" }}>
                {item.collectionPrice
                  ? `${item.collectionPrice} ${item.currency}`
                  : "Price not available"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: "10px" }}
              >
                View Details
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Catalog;
