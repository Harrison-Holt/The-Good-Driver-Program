import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Catalog from './components/Catalog/Catalog';
import Cart from './components/Catalog/Cart'; // Import the Cart page
import Confirmation from './components/Catalog/Confirmation'; // Import the Confirmation page
import { Provider } from 'react-redux';
import { store } from './store/store';
import Profile from './pages/Profile';
import { createRoot } from 'react-dom/client';
import Settings from './components/Settings/settings'; // Adjust the path if necessary

// Define the routes including Cart and Confirmationimport About from './pages/About';
import AuthCallback from './components/AuthCallback';  // Add the callback component
import PointChange from './components/PointChange.tsx';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/catalog",
    element: <Catalog />,
  },
  {
    path: "/cart", // Route for the Cart page
    element: <Cart />,
  },
  {
    path: "/confirmation", // Route for the Confirmation page
    element: <Confirmation />,
  },
  {
    path: "/point_change",
    element: <PointChange/>,
  },
  {
      path: "/profile",
      element: <Profile/>,
  },
  {
    path: "/auth-callback",  // Handle the Cognito redirect here
    element: <AuthCallback />
  }, 
  {
    path: "/settings", 
    element: <Settings />
  }
]);

// Render the root component with StrictMode and the router provider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
