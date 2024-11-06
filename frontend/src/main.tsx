// main.tsx
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { createRoot } from 'react-dom/client';
import { SettingsProvider } from './components/Settings/SettingsProvider';

import Home from './pages/Home';
import About from './pages/About';
import Catalog from './components/Catalog/Catalog';
import Cart from './components/Catalog/Cart';
import Confirmation from './components/Catalog/Confirmation';
import Profile from './pages/Profile';
import Settings from './pages/Settings/settings.tsx';
import AuthCallback from './components/AuthCallback';
import PointChange from './components/PointChange.tsx';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </Provider>
  </StrictMode>
);
