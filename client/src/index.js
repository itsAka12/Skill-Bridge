import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // global styles (optional)

// Get root container from public/index.html
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
