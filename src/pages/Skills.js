import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';

const Skills = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'All',
        level: searchParams.get('level') || 'All',
        skillType: searchParams.get('skillType') || 'All',
        sort: searchParams.get('sort') || 'newest'
    });

    const categories = [
        'All', 'Technology', 'Design', 'Business', 'Marketing', 'Writing',
        'Music', 'Art', 'Fitness', 'Cooking', 'Languages', 'Crafts', 'Photography', 'Other'
    ];

    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const skillTypes = ['All', 'Offering', 'Seeking'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'title', label: 'Title A-Z' }
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        // Check if opening create modal from URL
        if (searchParams.get('new') === 'true') {
            setIsCreateModalOpen(true);
            // Remove the 'new' parameter without affecting other params
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('new');
            setSearchParams(newSearchParams, { replace: true });
        }
        
        loadSkills();
    }, [filters]);

    const loadSkills = async (page = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                ...filters
            });

            const response = await api.get(`/skills?${params}`);
            
            if (page === 1) {
                setSkills(response.data.skills);
            } else {
                setSkills(prev => [...prev, ...response.data.skills]);
            }
            
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to load skills:', error);
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        // Update URL params
        const newSearchParams = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v && v !== 'All' && v !== '') {
                newSearchParams.set(k, v);
            }
        });
        setSearchParams(newSearchParams);
    };

    const handleExpressInterest = async (skillId) => {
        if (!user) {
            toast.error('Please sign in to express interest');
            return;
        }

        try {
            await api.post(`/skills/${skillId}/interest`, {
                message: 'I\'m interested in this skill exchange!'
            });
            toast.success('Interest expressed successfully!');
        } catch (error) {
            console.error('Failed to express interest:', error);
            toast.error(error.response?.data?.message || 'Failed to express interest');
        }
    };

    const handleCreateSkill = async (data) => {
        try {
            await api.post('/skills', {
                ...data,
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
                materials: data.materials ? data.materials.split(',').map(item => item.trim()).filter(Boolean) : []
            });
            
            toast.success('Skill created successfully!');
            setIsCreateModalOpen(false);
            reset();
            loadSkills(); // Reload skills
        } catch (error) {
            console.error('Failed to create skill:', error);
            toast.error(error.response?.data?.message || 'Failed to create skill');
        }
    };

    const loadMoreSkills = () => {
        if (pagination.page < pagination.pages) {
            loadSkills(pagination.page + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Explore Skills</h1>
                        <p className="text-gray-600 mt-2">
                            Discover amazing skills to learn or find people to teach
                        </p>
                    </div>
                    
                    {user && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors"
                        >
                            Share a Skill
                        </motion.button>
                    )}
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-md mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Skills
                            </label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search skills, topics, or keywords..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Level
                            </label>
                            <select
                                value={filters.level}
                                onChange={(e) => handleFilterChange('level', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Skill Type Filter */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {skillTypes.map(type => (
                                <motion.button
                                    key={type}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleFilterChange('skillType', type)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        filters.skillType === type
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {type === 'All' ? 'All Skills' : type}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Skills Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {loading && skills.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-lg shadow">
                                    <SkeletonLoader lines={4} />
                                </div>
                            ))}
                        </div>
                    ) : skills.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No skills found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your search filters or be the first to share a skill in this category.
                            </p>
                            {user && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Share a Skill
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <AnimatePresence>
                                    {skills.map((skill, index) => (
                                        <motion.div
                                            key={skill._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <SkillCard 
                                                skill={skill} 
                                                onInterest={handleExpressInterest}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Load More */}
                            {pagination.page < pagination.pages && (
                                <div className="text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={loadMoreSkills}
                                        disabled={loading}
                                        className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-300 font-medium shadow-sm transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <LoadingSpinner size="sm" /> : 'Load More Skills'}
                                    </motion.button>
                                </div>
                            )}

                            {/* Results Info */}
                            <div className="text-center mt-8 text-sm text-gray-600">
                                Showing {skills.length} of {pagination.total} skills
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Create Skill Modal */}
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Share a Skill</h2>
                                        <button
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(handleCreateSkill)} className="space-y-6">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Skill Title *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('title', {
                                                    required: 'Title is required',
                                                    maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
                                                })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., React.js Development, Guitar Lessons, Digital Marketing"
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description *
                                            </label>
                                            <textarea
                                                {...register('description', {
                                                    required: 'Description is required',
                                                    maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
                                                })}
                                                rows={4}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Describe what you'll teach or what you want to learn..."
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                            )}
                                        </div>

                                        {/* Category and Level */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Category *
                                                </label>
                                                <select
                                                    {...register('category', { required: 'Category is required' })}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.slice(1).map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                                {errors.category && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Level *
                                                </label>
                                                <select
                                                    {...register('level', { required: 'Level is required' })}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select level</option>
                                                    {levels.slice(1).map(level => (
                                                        <option key={level} value={level}>{level}</option>
                                                    ))}
                                                </select>
                                                {errors.level && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Skill Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Skill Type *
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        {...register('skillType', { required: 'Skill type is required' })}
                                                        value="Offering"
                                                        className="mr-2"
                                                    />
                                                    <span>I'm offering to teach this skill</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        {...register('skillType', { required: 'Skill type is required' })}
                                                        value="Seeking"
                                                        className="mr-2"
                                                    />
                                                    <span>I'm seeking to learn this skill</span>
                                                </label>
                                            </div>
                                            {errors.skillType && (
                                                <p className="mt-1 text-sm text-red-600">{errors.skillType.message}</p>
                                            )}
                                        </div>

                                        {/* Duration and Format */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Duration
                                                </label>
                                                <select
                                                    {...register('duration')}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="Flexible">Flexible</option>
                                                    <option value="30 minutes">30 minutes</option>
                                                    <option value="1 hour">1 hour</option>
                                                    <option value="2 hours">2 hours</option>
                                                    <option value="3+ hours">3+ hours</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Format
                                                </label>
                                                <select
                                                    {...register('format')}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="Online">Online</option>
                                                    <option value="In-person">In-person</option>
                                                    <option value="Both">Both</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tags (optional)
                                            </label>
                                            <input
                                                type="text"
                                                {...register('tags')}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Separate tags with commas (e.g., javascript, frontend, react)"
                                            />
                                        </div>

                                        {/* Prerequisites */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Prerequisites (optional)
                                            </label>
                                            <textarea
                                                {...register('prerequisites')}
                                                rows={2}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Any requirements or prior knowledge needed..."
                                            />
                                        </div>

                                        {/* Submit */}
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreateModalOpen(false)}
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                Share Skill
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Skills;
