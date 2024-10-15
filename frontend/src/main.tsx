import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Profile from './pages/Profile';
import Applications from './pages/Applications';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/about",
        element: <About/>
    },
    {
        path: "/profile",
        element: <Profile/>
    },
    {
        path: "/applications",
        element: <Applications/>
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={ router } />
    </Provider>
  </StrictMode>,
)
