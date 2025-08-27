const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { reviewee, skill, rating, comment, sessionType, sessionDate } = req.body;

        // Validation
        if (!reviewee || !skill || !rating || !comment || !sessionType || !sessionDate) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        // Check if reviewer is not reviewing themselves
        if (reviewee === req.userId) {
            return res.status(400).json({ 
                message: 'Cannot review yourself' 
            });
        }

        // Check if skill exists and belongs to reviewee
        const skillDoc = await Skill.findById(skill);
        if (!skillDoc) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (skillDoc.provider.toString() !== reviewee) {
            return res.status(400).json({ 
                message: 'Skill does not belong to the specified user' 
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            reviewer: req.userId,
            reviewee,
            skill
        });

        if (existingReview) {
            return res.status(400).json({ 
                message: 'You have already reviewed this skill exchange' 
            });
        }

        // Create review
        const review = new Review({
            reviewer: req.userId,
            reviewee,
            skill,
            rating,
            comment,
            sessionType,
            sessionDate: new Date(sessionDate)
        });

        await review.save();

        // Update user's average rating
        const userReviews = await Review.find({ 
            reviewee, 
            isVisible: true 
        });

        const totalRating = userReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / userReviews.length;

        await User.findByIdAndUpdate(reviewee, {
            'rating.average': Math.round(averageRating * 10) / 10,
            'rating.count': userReviews.length
        });

        const populatedReview = await Review.findById(review._id)
            .populate('reviewer', 'username firstName lastName profilePicture')
            .populate('reviewee', 'username firstName lastName')
            .populate('skill', 'title');

        res.status(201).json({
            message: 'Review created successfully',
            review: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ 
            message: 'Failed to create review',
            error: error.message 
        });
    }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const reviews = await Review.find({ 
            reviewee: req.params.userId, 
            isVisible: true 
        })
        .populate('reviewer', 'username firstName lastName profilePicture')
        .populate('skill', 'title category')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

        const total = await Review.countDocuments({ 
            reviewee: req.params.userId, 
            isVisible: true 
        });

        res.json({
            reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch reviews',
            error: error.message 
        });
    }
});

// @route   GET /api/reviews/skill/:skillId
// @desc    Get reviews for a skill
// @access  Public
router.get('/skill/:skillId', async (req, res) => {
    try {
        const reviews = await Review.find({ 
            skill: req.params.skillId, 
            isVisible: true 
        })
        .populate('reviewer', 'username firstName lastName profilePicture')
        .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (error) {
        console.error('Get skill reviews error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch skill reviews',
            error: error.message 
        });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.reviewer.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to update this review' 
            });
        }

        const { rating, comment } = req.body;
        const allowedUpdates = { rating, comment };

        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            { new: true, runValidators: true }
        )
        .populate('reviewer', 'username firstName lastName profilePicture')
        .populate('skill', 'title');

        // Recalculate user's average rating
        const userReviews = await Review.find({ 
            reviewee: review.reviewee, 
            isVisible: true 
        });

        const totalRating = userReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = totalRating / userReviews.length;

        await User.findByIdAndUpdate(review.reviewee, {
            'rating.average': Math.round(averageRating * 10) / 10,
            'rating.count': userReviews.length
        });

        res.json({
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ 
            message: 'Failed to update review',
            error: error.message 
        });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.reviewer.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to delete this review' 
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        // Recalculate user's average rating
        const userReviews = await Review.find({ 
            reviewee: review.reviewee, 
            isVisible: true 
        });

        const totalRating = userReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const averageRating = userReviews.length > 0 ? totalRating / userReviews.length : 0;

        await User.findByIdAndUpdate(review.reviewee, {
            'rating.average': Math.round(averageRating * 10) / 10,
            'rating.count': userReviews.length
        });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ 
            message: 'Failed to delete review',
            error: error.message 
        });
    }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if user already marked as helpful
        const existingVote = review.helpfulVotes.find(
            vote => vote.user.toString() === req.userId
        );

        if (existingVote) {
            // Remove helpful vote
            review.helpfulVotes = review.helpfulVotes.filter(
                vote => vote.user.toString() !== req.userId
            );
        } else {
            // Add helpful vote
            review.helpfulVotes.push({ user: req.userId });
        }

        await review.save();

        res.json({
            message: existingVote ? 'Helpful vote removed' : 'Marked as helpful',
            helpfulCount: review.helpfulVotes.length,
            isHelpful: !existingVote
        });
    } catch (error) {
        console.error('Toggle helpful error:', error);
        res.status(500).json({ 
            message: 'Failed to toggle helpful status',
            error: error.message 
        });
    }
});

module.exports = router;
