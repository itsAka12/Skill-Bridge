import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner';
import UserProfile from '../components/UserProfile';
import SkillCard from '../components/SkillCard';
import ReviewCard from '../components/ReviewCard';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, updateUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [userSkills, setUserSkills] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [skillFilter, setSkillFilter] = useState('All');

    const isOwner = !id || (currentUser && currentUser.id === id);
    const targetUserId = id || currentUser?.id;

    useEffect(() => {
        if (targetUserId) {
            loadProfileData();
        }
    }, [targetUserId]);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            
            // Load user profile
            const userResponse = await api.get(`/users/${targetUserId}`);
            setProfileUser(userResponse.data.user);
            setUserSkills(userResponse.data.skills || []);
            setUserReviews(userResponse.data.reviews || []);
            
        } catch (error) {
            console.error('Failed to load profile data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleUserUpdate = (updatedUser) => {
        setProfileUser(updatedUser);
        if (isOwner) {
            updateUser(updatedUser);
        }
    };

    const handleExpressInterest = async (skillId) => {
        if (!currentUser) {
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

    const handleReviewHelpful = async (reviewId) => {
        if (!currentUser) {
            toast.error('Please sign in to mark reviews as helpful');
            return;
        }

        try {
            const response = await api.post(`/reviews/${reviewId}/helpful`);
            toast.success(response.data.message);
            
            // Update reviews state
            setUserReviews(prev => prev.map(review => 
                review._id === reviewId 
                    ? {
                        ...review,
                        helpfulVotes: response.data.isHelpful 
                            ? [...(review.helpfulVotes || []), { user: currentUser.id }]
                            : (review.helpfulVotes || []).filter(vote => vote.user !== currentUser.id)
                    }
                    : review
            ));
        } catch (error) {
            console.error('Failed to toggle helpful status:', error);
            toast.error('Failed to update helpful status');
        }
    };

    const handleReviewEdit = async (reviewId, updatedReview) => {
        try {
            const response = await api.put(`/reviews/${reviewId}`, updatedReview);
            toast.success('Review updated successfully');
            
            // Update reviews state
            setUserReviews(prev => prev.map(review => 
                review._id === reviewId ? response.data.review : review
            ));
        } catch (error) {
            console.error('Failed to update review:', error);
            toast.error('Failed to update review');
        }
    };

    const handleReviewDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await api.delete(`/reviews/${reviewId}`);
            toast.success('Review deleted successfully');
            
            // Remove from reviews state
            setUserReviews(prev => prev.filter(review => review._id !== reviewId));
        } catch (error) {
            console.error('Failed to delete review:', error);
            toast.error('Failed to delete review');
        }
    };

    const filteredSkills = userSkills.filter(skill => {
        if (skillFilter === 'All') return true;
        return skill.skillType === skillFilter;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                            <SkeletonLoader lines={3} className="text-white" />
                        </div>
                        <div className="p-6">
                            <SkeletonLoader lines={5} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
                    <p className="mt-1 text-sm text-gray-500">The user you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
            >
                {/* User Profile */}
                <motion.div variants={itemVariants}>
                    <UserProfile 
                        user={profileUser}
                        isOwner={isOwner}
                        onUpdate={handleUserUpdate}
                    />
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants}>
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'about', name: 'About', icon: '👤' },
                                { id: 'skills', name: 'Skills', icon: '🎯', count: userSkills.length },
                                { id: 'reviews', name: 'Reviews', icon: '⭐', count: userReviews.length }
                            ].map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ y: -2 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.name}</span>
                                    {tab.count !== undefined && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            activeTab === tab.id
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div variants={itemVariants}>
                    {activeTab === 'about' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About {profileUser.firstName}</h3>
                            
                            {/* Bio */}
                            <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-900 mb-2">Bio</h4>
                                <p className="text-gray-700 leading-relaxed">
                                    {profileUser.bio || 'No bio available.'}
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{userSkills.length}</div>
                                    <div className="text-sm text-blue-700">Total Skills</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {userSkills.filter(s => s.skillType === 'Offering').length}
                                    </div>
                                    <div className="text-sm text-green-700">Teaching</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {userSkills.filter(s => s.skillType === 'Seeking').length}
                                    </div>
                                    <div className="text-sm text-purple-700">Learning</div>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {profileUser.rating?.average?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="text-sm text-yellow-700">Rating</div>
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="text-sm text-gray-600">
                                Member since {new Date(profileUser.joinedDate || profileUser.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long'
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div>
                            {/* Skills Filter */}
                            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {['All', 'Offering', 'Seeking'].map(filter => (
                                        <motion.button
                                            key={filter}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSkillFilter(filter)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                                skillFilter === filter
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {filter} {filter !== 'All' && `(${userSkills.filter(s => s.skillType === filter).length})`}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Grid */}
                            {filteredSkills.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No skills found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isOwner 
                                            ? "You haven't added any skills yet. Share your expertise with the community!"
                                            : `${profileUser.firstName} hasn't shared any ${skillFilter.toLowerCase() === 'all' ? '' : skillFilter.toLowerCase() + ' '}skills yet.`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <SkillCard 
                                                skill={skill} 
                                                onInterest={!isOwner ? handleExpressInterest : undefined}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {userReviews.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {isOwner 
                                            ? "You haven't received any reviews yet. Complete skill exchanges to earn your first review!"
                                            : `${profileUser.firstName} hasn't received any reviews yet.`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {userReviews.map((review, index) => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <ReviewCard
                                                review={review}
                                                onHelpful={handleReviewHelpful}
                                                onEdit={handleReviewEdit}
                                                onDelete={handleReviewDelete}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Profile;
