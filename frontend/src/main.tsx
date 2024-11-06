// main.tsx
import { StrictMode } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { createRoot } from 'react-dom/client';

import Home from './pages/Home';
import About from './pages/About';
import Catalog from './components/Catalog/Catalog';
import Cart from './components/Catalog/Cart';
import Confirmation from './components/Catalog/Confirmation';
import Profile from './pages/Profile';
import AuthCallback from './components/AuthCallback';
import Settings from './pages/Settings/settings.tsx'; // Adjust path if necessary
import PointChange from './components/PointChange.tsx';

// Define the routes
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/catalog", element: <Catalog /> },
  { path: "/cart", element: <Cart /> },
  { path: "/confirmation", element: <Confirmation /> },
  { path: "/point_change", element: <PointChange /> },
  { path: "/profile", element: <Profile /> },
  { path: "/auth-callback", element: <AuthCallback /> },
  { path: "/settings", element: <Settings /> } // Ensure this path is correct
]);

// Render the root component with StrictMode and the router provider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
