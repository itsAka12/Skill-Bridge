const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
        trim: true
    },
    messageType: {
        type: String,
        enum: ['text', 'skill_request', 'skill_response', 'file'],
        default: 'text'
    },
    relatedSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    },
    attachments: [{
        filename: String,
        url: String,
        fileType: String,
        fileSize: Number
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        emoji: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for efficient conversation queries
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ recipient: 1, createdAt: -1 });

// Static method to generate conversation ID
MessageSchema.statics.generateConversationId = function(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
};

module.exports = mongoose.model('Message', MessageSchema);
