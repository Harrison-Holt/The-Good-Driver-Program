// main.tsx
import React, { StrictMode } from 'react';
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
import Settings from './pages/Settings/settings';
import PointChange from './components/PointChange.tsx';
import { useSettings } from './components/Settings/settings_context';
import { SettingsProvider } from './components/Settings/SettingsProvider.tsx'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/catalog', element: <Catalog /> },
  { path: '/cart', element: <Cart /> },
  { path: '/confirmation', element: <Confirmation /> },
  { path: '/profile', element: <Profile /> },
  { path: '/auth-callback', element: <AuthCallback /> },
  { path: '/settings', element: <Settings /> },
  { path: '/point_change', element: <PointChange /> },
]);

// eslint-disable-next-line react-refresh/only-export-components
const AppContent: React.FC = () => {
  const { settings } = useSettings();

  // Define global styles based on settings
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
  });

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <Box
        sx={{
          filter: settings.isGreyscale ? 'grayscale(100%)' : 'none',
          transform: `scale(${settings.zoomLevel})`, // Apply zoom globally
          transformOrigin: 'top left', // Scale from top left for consistent layout
          minHeight: '100vh',
          transition: 'all 0.3s ease', // Smooth transitions
        }}
      >
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <SettingsProvider> {/* Wrap the app in SettingsProvider for global context */}
          <AppContent />
        </SettingsProvider>
      </Provider>
    </StrictMode>
  );
}
