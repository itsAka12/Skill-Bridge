const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters'],
        trim: true
    },
    sessionType: {
        type: String,
        enum: ['Teaching', 'Learning', 'Exchange'],
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    helpfulVotes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    reportedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews for same skill exchange
ReviewSchema.index({ reviewer: 1, reviewee: 1, skill: 1 }, { unique: true });

// Index for efficient queries
ReviewSchema.index({ reviewee: 1, isVisible: 1, createdAt: -1 });
ReviewSchema.index({ reviewer: 1, createdAt: -1 });
ReviewSchema.index({ skill: 1, isVisible: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
