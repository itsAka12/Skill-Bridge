import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

// Start React app on port 5000
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Hot reload for development
if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default;
        root.render(
            <React.StrictMode>
                <NextApp />
            </React.StrictMode>
        );
    });
}
