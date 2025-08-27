const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ 
                message: 'No authorization header provided' 
            });
        }

        // Check if token starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Invalid authorization format. Use Bearer token.' 
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            return res.status(401).json({ 
                message: 'No token provided' 
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'fallback_secret_key'
        );

        // Add user ID to request
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token has expired. Please login again.' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token. Please login again.' 
            });
        }

        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            message: 'Authentication failed',
            error: error.message 
        });
    }
};

module.exports = auth;
