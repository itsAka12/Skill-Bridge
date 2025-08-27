const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
    try {
        const userId = req.userId;

        // Get all conversations for the user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ],
                    isDeleted: false
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversation',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$recipient', userId] },
                                        { $eq: [{ $size: '$readBy' }, 0] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'lastMessage.sender',
                    foreignField: '_id',
                    as: 'senderInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'lastMessage.recipient',
                    foreignField: '_id',
                    as: 'recipientInfo'
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            }
        ]);

        // Format conversations with participant info
        const formattedConversations = conversations.map(conv => {
            const otherParticipant = conv.lastMessage.sender.toString() === userId ? 
                conv.recipientInfo[0] : conv.senderInfo[0];

            return {
                conversationId: conv._id,
                participant: {
                    id: otherParticipant._id,
                    username: otherParticipant.username,
                    firstName: otherParticipant.firstName,
                    lastName: otherParticipant.lastName,
                    profilePicture: otherParticipant.profilePicture
                },
                lastMessage: {
                    content: conv.lastMessage.content,
                    timestamp: conv.lastMessage.createdAt,
                    isOwn: conv.lastMessage.sender.toString() === userId
                },
                unreadCount: conv.unreadCount
            };
        });

        res.json({ conversations: formattedConversations });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch conversations',
            error: error.message 
        });
    }
});

// @route   GET /api/messages/:conversationId
// @desc    Get messages in a conversation
// @access  Private
router.get('/:conversationId', auth, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const userId = req.userId;

        // Verify user is part of conversation
        const [senderId, recipientId] = conversationId.split('_');
        if (senderId !== userId && recipientId !== userId) {
            return res.status(403).json({ 
                message: 'Not authorized to access this conversation' 
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const messages = await Message.find({ 
            conversation: conversationId,
            isDeleted: false
        })
        .populate('sender', 'username firstName lastName profilePicture')
        .populate('recipient', 'username firstName lastName profilePicture')
        .populate('relatedSkill', 'title')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        const total = await Message.countDocuments({ 
            conversation: conversationId,
            isDeleted: false
        });

        // Mark messages as read
        await Message.updateMany(
            {
                conversation: conversationId,
                recipient: userId,
                'readBy.user': { $ne: userId }
            },
            {
                $addToSet: {
                    readBy: {
                        user: userId,
                        readAt: new Date()
                    }
                }
            }
        );

        res.json({
            messages: messages.reverse(), // Reverse to show oldest first
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch messages',
            error: error.message 
        });
    }
});

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { recipient, content, messageType = 'text', relatedSkill } = req.body;
        const senderId = req.userId;

        if (!recipient || !content) {
            return res.status(400).json({ 
                message: 'Recipient and content are required' 
            });
        }

        if (recipient === senderId) {
            return res.status(400).json({ 
                message: 'Cannot send message to yourself' 
            });
        }

        // Verify recipient exists
        const recipientUser = await User.findById(recipient);
        if (!recipientUser) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Generate conversation ID
        const conversationId = Message.generateConversationId(senderId, recipient);

        const message = new Message({
            conversation: conversationId,
            sender: senderId,
            recipient,
            content,
            messageType,
            relatedSkill
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username firstName lastName profilePicture')
            .populate('recipient', 'username firstName lastName profilePicture')
            .populate('relatedSkill', 'title');

        res.status(201).json({
            message: 'Message sent successfully',
            data: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ 
            message: 'Failed to send message',
            error: error.message 
        });
    }
});

// @route   PUT /api/messages/:id
// @desc    Edit a message
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user owns the message
        if (message.sender.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to edit this message' 
            });
        }

        // Check if message was sent within 15 minutes (edit window)
        const editWindow = 15 * 60 * 1000; // 15 minutes in milliseconds
        if (Date.now() - message.createdAt.getTime() > editWindow) {
            return res.status(400).json({ 
                message: 'Message edit window has expired (15 minutes)' 
            });
        }

        message.content = content;
        message.isEdited = true;
        message.editedAt = new Date();

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username firstName lastName profilePicture')
            .populate('recipient', 'username firstName lastName profilePicture');

        res.json({
            message: 'Message updated successfully',
            data: populatedMessage
        });
    } catch (error) {
        console.error('Edit message error:', error);
        res.status(500).json({ 
            message: 'Failed to edit message',
            error: error.message 
        });
    }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user owns the message
        if (message.sender.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to delete this message' 
            });
        }

        message.isDeleted = true;
        message.deletedAt = new Date();
        await message.save();

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ 
            message: 'Failed to delete message',
            error: error.message 
        });
    }
});

// @route   POST /api/messages/:id/react
// @desc    Add reaction to message
// @access  Private
router.post('/:id/react', auth, async (req, res) => {
    try {
        const { emoji } = req.body;
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Check if user is part of the conversation
        const [senderId, recipientId] = message.conversation.split('_');
        if (senderId !== req.userId && recipientId !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to react to this message' 
            });
        }

        // Check if user already reacted
        const existingReaction = message.reactions.find(
            reaction => reaction.user.toString() === req.userId
        );

        if (existingReaction) {
            if (existingReaction.emoji === emoji) {
                // Remove reaction if same emoji
                message.reactions = message.reactions.filter(
                    reaction => reaction.user.toString() !== req.userId
                );
            } else {
                // Update reaction emoji
                existingReaction.emoji = emoji;
                existingReaction.date = new Date();
            }
        } else {
            // Add new reaction
            message.reactions.push({
                user: req.userId,
                emoji,
                date: new Date()
            });
        }

        await message.save();

        res.json({
            message: 'Reaction updated successfully',
            reactions: message.reactions
        });
    } catch (error) {
        console.error('React to message error:', error);
        res.status(500).json({ 
            message: 'Failed to react to message',
            error: error.message 
        });
    }
});

module.exports = router;
