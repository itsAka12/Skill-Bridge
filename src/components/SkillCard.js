import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill, onInterest }) => {
    const handleInterestClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onInterest && onInterest(skill._id);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner':
                return 'bg-green-100 text-green-800';
            case 'Intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'Advanced':
                return 'bg-orange-100 text-orange-800';
            case 'Expert':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        return type === 'Offering' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-purple-100 text-purple-800';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <Link to={`/skills/${skill._id}`} className="block">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                {skill.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(skill.skillType)}`}>
                                    {skill.skillType}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                                    {skill.level}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                    {skill.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {skill.description}
                    </p>

                    {/* Provider Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={skill.provider?.profilePicture || 
                                    `https://ui-avatars.com/api/?name=${skill.provider?.firstName}+${skill.provider?.lastName}&background=6366f1&color=fff`}
                                alt={skill.provider?.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {skill.provider?.firstName} {skill.provider?.lastName}
                                </p>
                                <div className="flex items-center space-x-1">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-3 h-3 ${
                                                    i < Math.floor(skill.provider?.rating?.average || 0)
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-200'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        ({skill.provider?.rating?.count || 0})
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interest Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleInterestClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            {skill.skillType === 'Offering' ? 'Learn' : 'Teach'}
                        </motion.button>
                    </div>

                    {/* Tags */}
                    {skill.tags && skill.tags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap gap-1">
                                {skill.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {skill.tags.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                        +{skill.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Footer Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {skill.views || 0} views
                            </span>
                            <span className="flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {skill.duration}
                            </span>
                        </div>
                        <span>
                            {new Date(skill.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default SkillCard;
