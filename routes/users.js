const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with search and filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            skills,
            location
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        // Search by name, username, or skills
        if (search) {
            filter.$text = { $search: search };
        }

        // Filter by skills
        if (skills) {
            filter['skills.name'] = { $regex: skills, $options: 'i' };
        }

        // Filter by location
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(filter)
            .select('-password -email')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ rating: -1, createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch users',
            error: error.message 
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's skills
        const skills = await Skill.find({ 
            provider: req.params.id, 
            isActive: true 
        }).sort({ createdAt: -1 });

        // Get user's reviews
        const reviews = await Review.find({ 
            reviewee: req.params.id, 
            isVisible: true 
        })
        .populate('reviewer', 'username firstName lastName profilePicture')
        .populate('skill', 'title')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({ 
            user: user.getPublicProfile(), 
            skills, 
            reviews 
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch user',
            error: error.message 
        });
    }
});

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Public
router.get('/:id/stats', async (req, res) => {
    try {
        const userId = req.params.id;

        // Get skills count
        const skillsOffered = await Skill.countDocuments({
            provider: userId,
            skillType: 'Offering',
            isActive: true
        });

        const skillsSeeking = await Skill.countDocuments({
            provider: userId,
            skillType: 'Seeking',
            isActive: true
        });

        // Get reviews stats
        const reviewsReceived = await Review.countDocuments({
            reviewee: userId,
            isVisible: true
        });

        const reviewsGiven = await Review.countDocuments({
            reviewer: userId,
            isVisible: true
        });

        // Get average rating
        const ratingStats = await Review.aggregate([
            { $match: { reviewee: userId, isVisible: true } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            skillsOffered,
            skillsSeeking,
            reviewsReceived,
            reviewsGiven,
            averageRating: ratingStats.length > 0 ? 
                Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
            totalRatings: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0
        };

        res.json({ stats });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch user statistics',
            error: error.message 
        });
    }
});

// @route   POST /api/users/:id/follow
// @desc    Follow/unfollow a user
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.userId;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ 
                message: 'Cannot follow yourself' 
            });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For now, just return success - follow functionality can be expanded
        res.json({ 
            message: 'Follow functionality coming soon',
            following: false 
        });
    } catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ 
            message: 'Failed to follow user',
            error: error.message 
        });
    }
});

// @route   GET /api/users/search/suggestions
// @desc    Get user search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json({ suggestions: [] });
        }

        const suggestions = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { firstName: { $regex: q, $options: 'i' } },
                { lastName: { $regex: q, $options: 'i' } }
            ],
            isActive: true
        })
        .select('username firstName lastName profilePicture')
        .limit(5);

        res.json({ suggestions });
    } catch (error) {
        console.error('Get search suggestions error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch search suggestions',
            error: error.message 
        });
    }
});

module.exports = router;
