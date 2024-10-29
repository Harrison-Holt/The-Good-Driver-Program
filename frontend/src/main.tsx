import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

// Define the routes including Cart and Confirmationimport About from './pages/About';
import AuthCallback from './components/AuthCallback';  // Add the callback component

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
      path: "/profile",
      element: <Profile/>,
  },
  {
    path: "/auth-callback",  // Handle the Cognito redirect here
    element: <AuthCallback />
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
