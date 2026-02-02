import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserContextProvider from './core/context/UserContext.jsx';
import AuthContextProvider from './core/context/AuthContext.jsx';
import 'rc-steps/assets/index.css';
import 'leaflet/dist/leaflet.css';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </QueryClientProvider> 
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
