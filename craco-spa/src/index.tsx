import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './theme/theme-provider';
import { Toaster } from './components/ui/toaster';
import { UserProvider } from './state/user-provider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
        <App />
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
