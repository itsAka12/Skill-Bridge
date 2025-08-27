const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Note: MongoDB connection disabled for demo - using in-memory data
console.log('Running in demo mode with in-memory data');

const app = express();

// Basic middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'SkillBridge API is working!', timestamp: new Date().toISOString() });
});

// Try to load API routes
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/skills', require('./routes/skills'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/reviews', require('./routes/reviews'));
    app.use('/api/messages', require('./routes/messages'));
    app.use('/api/upload', require('./routes/upload'));
    console.log('All API routes loaded successfully');
} catch (error) {
    console.log('Some API routes failed to load:', error.message);
    // Basic fallback routes
    app.get('/api/*', (req, res) => {
        res.status(503).json({ message: 'API temporarily unavailable', error: 'Routes not loaded' });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// Serve React app for all other routes - MUST be last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillBridge server running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`API available at: http://localhost:${PORT}/api`);
});