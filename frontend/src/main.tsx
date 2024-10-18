import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Catalog from './components/Catalog/Catalog';
import ProductDetails from './components/Catalog/ProductDetails'; // Import ProductDetails
import { Provider } from 'react-redux';
import { store } from './store/store';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/about",
        element: <About />
    },
    {
        path: "/catalog",  
        element: <Catalog />
    },
    {
        path: "/product/:itemId", 
        element: <ProductDetails />
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
