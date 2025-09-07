import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ReviewCard = ({ review, onHelpful, onEdit, onDelete }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(review.comment);
    const [editRating, setEditRating] = useState(review.rating);

    const handleEdit = () => {
        onEdit(review._id, { comment: editText, rating: editRating });
        setIsEditing(false);
    };

    const handleHelpful = () => {
        onHelpful(review._id);
    };

    const isOwnReview = user && user.id === review.reviewer._id;
    const isHelpful = review.helpfulVotes?.some(vote => vote.user === user?.id);

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                    <motion.svg
                        key={i}
                        whileHover={interactive ? { scale: 1.1 } : {}}
                        onClick={interactive ? () => onRatingChange(i + 1) : undefined}
                        className={`w-4 h-4 ${
                            i < rating
                                ? 'text-yellow-400'
                                : 'text-gray-200'
                        } ${interactive ? 'cursor-pointer' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                ))}
            </div>
        );
    };

    const getSessionTypeColor = (type) => {
        switch (type) {
            case 'Teaching':
                return 'bg-blue-100 text-blue-800';
            case 'Learning':
                return 'bg-green-100 text-green-800';
            case 'Exchange':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={review.reviewer.profilePicture || 
                            `https://ui-avatars.com/api/?name=${review.reviewer.firstName}+${review.reviewer.lastName}&background=6366f1&color=fff`}
                        alt={review.reviewer.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {review.reviewer.firstName} {review.reviewer.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">@{review.reviewer.username}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(review.sessionType)}`}>
                        {review.sessionType}
                    </span>
                    {isOwnReview && (
                        <div className="flex space-x-1">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onDelete(review._id)}
                                className="text-red-600 hover:text-red-800 p-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            {/* Rating */}
            <div className="mb-3">
                {isEditing ? (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        {renderStars(editRating, true, setEditRating)}
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                            {review.rating}/5
                        </span>
                    </div>
                )}
            </div>

            {/* Comment */}
            <div className="mb-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Update your review..."
                        />
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                Save
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
            </div>

            {/* Skill Info */}
            {review.skill && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">Skill:</span>
                        <span className="text-sm text-gray-600">{review.skill.title}</span>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <span>
                        Session: {new Date(review.sessionDate).toLocaleDateString()}
                    </span>
                    <span>
                        Reviewed: {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Helpful Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHelpful}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                        isHelpful
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{review.helpfulVotes?.length || 0}</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ReviewCard;
