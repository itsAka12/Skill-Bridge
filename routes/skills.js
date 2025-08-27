const express = require('express');
const Skill = require('../models/Skill');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills with filtering and search
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            level,
            skillType,
            search,
            sort = 'newest'
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        if (category && category !== 'All') filter.category = category;
        if (level && level !== 'All') filter.level = level;
        if (skillType && skillType !== 'All') filter.skillType = skillType;
        
        // Build search query
        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort object
        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'popular':
                sortOption = { views: -1 };
                break;
            case 'title':
                sortOption = { title: 1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const skills = await Skill.find(filter)
            .populate('provider', 'username firstName lastName profilePicture rating')
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Skill.countDocuments(filter);

        res.json({
            skills,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch skills',
            error: error.message 
        });
    }
});

// @route   GET /api/skills/:id
// @desc    Get skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)
            .populate('provider', 'username firstName lastName profilePicture rating bio location')
            .populate('interested.user', 'username firstName lastName profilePicture');

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Increment view count
        skill.views += 1;
        await skill.save();

        res.json({ skill });
    } catch (error) {
        console.error('Get skill error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch skill',
            error: error.message 
        });
    }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const skillData = {
            ...req.body,
            provider: req.userId
        };

        const skill = new Skill(skillData);
        await skill.save();

        const populatedSkill = await Skill.findById(skill._id)
            .populate('provider', 'username firstName lastName profilePicture rating');

        res.status(201).json({
            message: 'Skill created successfully',
            skill: populatedSkill
        });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({ 
            message: 'Failed to create skill',
            error: error.message 
        });
    }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check if user owns the skill
        if (skill.provider.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to update this skill' 
            });
        }

        const updatedSkill = await Skill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('provider', 'username firstName lastName profilePicture rating');

        res.json({
            message: 'Skill updated successfully',
            skill: updatedSkill
        });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ 
            message: 'Failed to update skill',
            error: error.message 
        });
    }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check if user owns the skill
        if (skill.provider.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to delete this skill' 
            });
        }

        await Skill.findByIdAndDelete(req.params.id);

        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({ 
            message: 'Failed to delete skill',
            error: error.message 
        });
    }
});

// @route   POST /api/skills/:id/interest
// @desc    Express interest in a skill
// @access  Private
router.post('/:id/interest', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check if user is not the skill provider
        if (skill.provider.toString() === req.userId) {
            return res.status(400).json({ 
                message: 'Cannot express interest in your own skill' 
            });
        }

        // Check if user already expressed interest
        const existingInterest = skill.interested.find(
            interest => interest.user.toString() === req.userId
        );

        if (existingInterest) {
            return res.status(400).json({ 
                message: 'You have already expressed interest in this skill' 
            });
        }

        skill.interested.push({
            user: req.userId,
            message: message || '',
            date: new Date(),
            status: 'Pending'
        });

        await skill.save();

        const updatedSkill = await Skill.findById(skill._id)
            .populate('provider', 'username firstName lastName profilePicture')
            .populate('interested.user', 'username firstName lastName profilePicture');

        res.json({
            message: 'Interest expressed successfully',
            skill: updatedSkill
        });
    } catch (error) {
        console.error('Express interest error:', error);
        res.status(500).json({ 
            message: 'Failed to express interest',
            error: error.message 
        });
    }
});

// @route   PUT /api/skills/:id/interest/:interestId
// @desc    Update interest status
// @access  Private
router.put('/:id/interest/:interestId', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Check if user owns the skill
        if (skill.provider.toString() !== req.userId) {
            return res.status(403).json({ 
                message: 'Not authorized to update interest status' 
            });
        }

        const interest = skill.interested.id(req.params.interestId);
        if (!interest) {
            return res.status(404).json({ message: 'Interest not found' });
        }

        interest.status = status;
        await skill.save();

        res.json({
            message: 'Interest status updated successfully',
            interest
        });
    } catch (error) {
        console.error('Update interest error:', error);
        res.status(500).json({ 
            message: 'Failed to update interest status',
            error: error.message 
        });
    }
});

// @route   GET /api/skills/user/:userId
// @desc    Get skills by user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const { skillType = 'All' } = req.query;
        const filter = { 
            provider: req.params.userId,
            isActive: true 
        };

        if (skillType !== 'All') {
            filter.skillType = skillType;
        }

        const skills = await Skill.find(filter)
            .populate('provider', 'username firstName lastName profilePicture rating')
            .sort({ createdAt: -1 });

        res.json({ skills });
    } catch (error) {
        console.error('Get user skills error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch user skills',
            error: error.message 
        });
    }
});

module.exports = router;
