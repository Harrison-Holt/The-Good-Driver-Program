import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import Navibar from '../../components/Navibar';
import { useSettings } from '../../components/Settings/settings_context';

interface AboutData {
  team_number: number;
  sprint_number: number;
  release_date: string;
  product_name: string;
  product_description: string;
}

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  const { settings } = useSettings(); // Access settings from context

  // Fetch the "About" page data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://0w2ntl28if.execute-api.us-east-1.amazonaws.com/dec-db/about');
        let data = await response.json();
        data = JSON.parse(data.body); // Parse the `body` if necessary
        setAboutData(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ lineHeight: settings.lineHeight || 1.5 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navibar />
      <Box
        sx={{
          padding: 4,
          backgroundColor: 'background.default',
          color: 'text.primary',
          lineHeight: settings.lineHeight || 1.5, // Apply lineHeight globally
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ lineHeight: settings.lineHeight || 1.5 }}
          >
            About Our {aboutData?.product_name}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ lineHeight: settings.lineHeight || 1.5 }}
          >
            A system designed to reward and incentivize truck drivers for safe and efficient driving.
          </Typography>
        </Box>

        {/* Project Information Section */}
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            mt: 4,
            lineHeight: settings.lineHeight || 1.5, // Apply lineHeight to the Paper
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            align="center"
            sx={{ lineHeight: settings.lineHeight || 1.5 }}
          >
            Project Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                <strong>Team Number:</strong> {aboutData?.team_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                <strong>Version (Sprint #):</strong> Sprint {aboutData?.sprint_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                <strong>Release Date:</strong> {aboutData?.release_date}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                <strong>Product Name:</strong> {aboutData?.product_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ lineHeight: settings.lineHeight || 1.5 }}>
                <strong>Product Description:</strong> {aboutData?.product_description}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default About;
