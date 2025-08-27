const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Skill title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Technology',
            'Design',
            'Business',
            'Marketing',
            'Writing',
            'Music',
            'Art',
            'Fitness',
            'Cooking',
            'Languages',
            'Crafts',
            'Photography',
            'Other'
        ]
    },
    subcategory: {
        type: String,
        trim: true,
        maxlength: [50, 'Subcategory cannot exceed 50 characters']
    },
    level: {
        type: String,
        required: [true, 'Skill level is required'],
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    skillType: {
        type: String,
        required: [true, 'Skill type is required'],
        enum: ['Offering', 'Seeking']
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    duration: {
        type: String,
        enum: ['30 minutes', '1 hour', '2 hours', '3+ hours', 'Flexible'],
        default: 'Flexible'
    },
    availability: {
        days: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }],
        timeSlots: [{
            start: String,
            end: String
        }],
        timezone: String
    },
    format: {
        type: String,
        enum: ['Online', 'In-person', 'Both'],
        default: 'Online'
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    exchangePreference: {
        type: String,
        enum: ['Skill for Skill', 'Skill for Learning', 'Both'],
        default: 'Both'
    },
    prerequisites: {
        type: String,
        maxlength: [300, 'Prerequisites cannot exceed 300 characters']
    },
    materials: [{
        type: String,
        maxlength: [100, 'Material item cannot exceed 100 characters']
    }],
    attachments: [{
        filename: String,
        url: String,
        fileType: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    interested: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Declined', 'Completed'],
            default: 'Pending'
        }
    }]
}, {
    timestamps: true
});

// Index for search and filtering
SkillSchema.index({ 
    title: 'text', 
    description: 'text', 
    tags: 'text',
    category: 1,
    level: 1,
    skillType: 1,
    isActive: 1
});

SkillSchema.index({ provider: 1, isActive: 1 });
SkillSchema.index({ category: 1, level: 1, isActive: 1 });
SkillSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Skill', SkillSchema);
