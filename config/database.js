const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge';
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        };

        const conn = await mongoose.connect(mongoURI, options);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (error) {
                console.error('Error during MongoDB disconnect:', error);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        
        // For development, continue without database
        if (process.env.NODE_ENV === 'development') {
            console.log('Continuing in development mode without database...');
            console.log('To connect to MongoDB:');
            console.log('1. Install MongoDB locally or use MongoDB Atlas');
            console.log('2. Set MONGODB_URI environment variable');
            console.log('3. Restart the application');
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
