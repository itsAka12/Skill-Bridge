import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentSkills, setRecentSkills] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Load user stats
            const statsResponse = await api.get(`/users/${user.id}/stats`);
            setStats(statsResponse.data.stats);

            // Load recent skills
            const skillsResponse = await api.get(`/skills/user/${user.id}?limit=6`);
            setRecentSkills(skillsResponse.data.skills);

            // Load recent conversations
            const messagesResponse = await api.get('/messages/conversations?limit=5');
            setRecentMessages(messagesResponse.data.conversations);

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleExpressInterest = async (skillId) => {
        try {
            await api.post(`/skills/${skillId}/interest`, {
                message: 'I\'m interested in this skill exchange!'
            });
            toast.success('Interest expressed successfully!');
        } catch (error) {
            console.error('Failed to express interest:', error);
            toast.error('Failed to express interest');
        }
    };

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <SkeletonLoader lines={2} className="mb-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow">
                                <SkeletonLoader lines={3} />
                            </div>
                        ))}
                    </div>
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
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.firstName}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's what's happening with your skills and connections
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                    variants={itemVariants} 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.skillsOffered || 0}
                                </p>
                                <p className="text-gray-600">Skills Offered</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.skillsSeeking || 0}
                                </p>
                                <p className="text-gray-600">Skills Learning</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.averageRating || '0.0'}
                                </p>
                                <p className="text-gray-600">Average Rating</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.reviewsReceived || 0}
                                </p>
                                <p className="text-gray-600">Reviews</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'overview', name: 'Overview', icon: '📊' },
                                { id: 'skills', name: 'My Skills', icon: '🎯' },
                                { id: 'messages', name: 'Recent Messages', icon: '💬' }
                            ].map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ y: -2 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </motion.button>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div variants={itemVariants}>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <motion.div whileHover={{ x: 5 }}>
                                        <Link
                                            to="/skills?new=true"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                        >
                                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Add New Skill</h4>
                                                <p className="text-sm text-gray-600">Share your expertise with others</p>
                                            </div>
                                        </Link>
                                    </motion.div>

                                    <motion.div whileHover={{ x: 5 }}>
                                        <Link
                                            to="/skills"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                                        >
                                            <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Browse Skills</h4>
                                                <p className="text-sm text-gray-600">Find skills to learn</p>
                                            </div>
                                        </Link>
                                    </motion.div>

                                    <motion.div whileHover={{ x: 5 }}>
                                        <Link
                                            to="/profile"
                                            className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                                        >
                                            <div className="p-2 bg-green-100 rounded-lg mr-3">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Update Profile</h4>
                                                <p className="text-sm text-gray-600">Keep your profile current</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {recentMessages.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                                    ) : (
                                        recentMessages.slice(0, 5).map((conversation, index) => (
                                            <motion.div
                                                key={conversation.conversationId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
                                            >
                                                <img
                                                    src={conversation.participant.profilePicture || 
                                                        `https://ui-avatars.com/api/?name=${conversation.participant.firstName}+${conversation.participant.lastName}&background=6366f1&color=fff&size=40`}
                                                    alt={conversation.participant.firstName}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {conversation.participant.firstName} {conversation.participant.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {conversation.lastMessage.content}
                                                    </p>
                                                </div>
                                                {conversation.unreadCount > 0 && (
                                                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-0">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Your Skills</h3>
                                <Link
                                    to="/skills?new=true"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Add New Skill
                                </Link>
                            </div>

                            {recentSkills.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No skills yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first skill.</p>
                                    <div className="mt-6">
                                        <Link
                                            to="/skills?new=true"
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Skill
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {recentSkills.map((skill, index) => (
                                        <motion.div
                                            key={skill._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <SkillCard 
                                                skill={skill} 
                                                onInterest={handleExpressInterest}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
                                <Link
                                    to="/messages"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    View All
                                </Link>
                            </div>

                            {recentMessages.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">Start conversations by connecting with other users.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                                    {recentMessages.map((conversation, index) => (
                                        <motion.div
                                            key={conversation.conversationId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                to={`/messages?conversation=${conversation.conversationId}`}
                                                className="block p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={conversation.participant.profilePicture || 
                                                            `https://ui-avatars.com/api/?name=${conversation.participant.firstName}+${conversation.participant.lastName}&background=6366f1&color=fff&size=48`}
                                                        alt={conversation.participant.firstName}
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900">
                                                            {conversation.participant.firstName} {conversation.participant.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {conversation.lastMessage.content}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {conversation.unreadCount > 0 && (
                                                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
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

export default Dashboard;
