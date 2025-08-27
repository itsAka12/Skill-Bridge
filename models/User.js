const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters'],
        default: ''
    },
    skills: [{
        name: {
            type: String,
            required: true
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: String
    }],
    learningInterests: [{
        type: String,
        trim: true
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    joinedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for search functionality
UserSchema.index({ 
    username: 'text', 
    firstName: 'text', 
    lastName: 'text', 
    'skills.name': 'text',
    'skills.category': 'text'
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Get user public profile (excluding sensitive data)
UserSchema.methods.getPublicProfile = function() {
    const user = this.toObject();
    delete user.password;
    delete user.email;
    return user;
};

module.exports = mongoose.model('User', UserSchema);
