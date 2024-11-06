import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, Box, ThemeProvider, createTheme } from '@mui/material';
import { store } from './store/store';

import Home from './pages/Home';
import About from './pages/About';
import Catalog from './components/Catalog/Catalog';
import Cart from './components/Catalog/Cart';
import Confirmation from './components/Catalog/Confirmation';
import Profile from './pages/Profile';
import AuthCallback from './components/AuthCallback';
import Settings from './components/Settings/settings';
import PointChange from './components/PointChange.tsx';
import { SettingsProvider, useSettings } from './components/Settings/settings_context';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

// Define the routes
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/cart", element: <Cart /> },
  { path: "/confirmation", element: <Confirmation /> },
  { path: "/profile", element: <Profile /> },
  { path: "/auth-callback", element: <AuthCallback /> },
  { path: "/settings", element: <Settings /> },
  { path: "/point_change", element: <PointChange /> },
]);

// Define App component and add an export to satisfy Fast Refresh
export const App: React.FC = () => {
  const { settings } = useSettings();

  // Dynamically create theme based on settings
  const appliedTheme = createTheme({
    palette: {
      mode: settings.isDarkMode ? 'dark' : 'light',
      background: {
        default: settings.isHighContrast ? '#000' : settings.isDarkMode ? '#121212' : '#fff',
        paper: settings.isHighContrast ? '#000' : undefined,
      },
      text: {
        primary: settings.isHighContrast ? '#fff' : settings.isDarkMode ? '#fff' : '#000',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: settings.isHighContrast ? '#000' : undefined,
            color: settings.isHighContrast ? '#fff' : undefined,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: settings.isHighContrast ? '#000' : undefined,
            color: settings.isHighContrast ? '#fff' : undefined,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: settings.isHighContrast ? '#fff' : undefined,
            backgroundColor: settings.isHighContrast ? '#333' : undefined,
            '&:hover': {
              backgroundColor: settings.isHighContrast ? '#555' : undefined,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: settings.isHighContrast ? '#000' : undefined,
            color: settings.isHighContrast ? '#fff' : undefined,
            boxShadow: settings.isHighContrast ? 'none' : undefined,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: settings.isHighContrast ? '#000' : undefined,
            color: settings.isHighContrast ? '#fff' : undefined,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: settings.isHighContrast ? '#fff' : undefined,
          },
        },
      },
    },
  });

  return (
    <Provider store={store}>
      <SettingsProvider>
        <ThemeProvider theme={appliedTheme}>
          <CssBaseline />
          <Box
            sx={{
              filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
              minHeight: '100vh',
              backgroundColor: 'background.default',
              color: 'text.primary',
              transform: `scale(${settings.zoomLevel})`,
              transformOrigin: 'top left',
              transition: 'all 0.3s ease',
            }}
          >
            <RouterProvider router={router} />
          </Box>
        </ThemeProvider>
      </SettingsProvider>
    </Provider>
  );
};

// Render the root component with StrictMode
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

