import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const UserProfile = ({ user, isOwner = false, onUpdate }) => {
    const { user: currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.bio || '',
        location: user?.location || '',
        skills: user?.skills || [],
        learningInterests: user?.learningInterests || []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillAdd = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, skill]
        }));
    };

    const handleSkillRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleInterestAdd = (interest) => {
        if (interest.trim() && !formData.learningInterests.includes(interest.trim())) {
            setFormData(prev => ({
                ...prev,
                learningInterests: [...prev.learningInterests, interest.trim()]
            }));
        }
    };

    const handleInterestRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            learningInterests: prev.learningInterests.filter((_, i) => i !== index)
        }));
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataUpload
            });

            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({
                    ...prev,
                    profilePicture: data.url
                }));
                onUpdate && onUpdate({ ...formData, profilePicture: data.url });
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                onUpdate && onUpdate(data.user);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'Advanced': return 'bg-orange-100 text-orange-800';
            case 'Expert': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) {
        return <LoadingSpinner />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff&size=120`}
                            alt={user.firstName}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        {isOwner && isEditing && (
                            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                                {isUploading ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex-1 text-white">
                        {isEditing ? (
                            <div className="space-y-3">
                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 backdrop-blur-sm"
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 backdrop-blur-sm"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 backdrop-blur-sm w-full"
                                    placeholder="Location"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                                <p className="text-blue-100">@{user.username}</p>
                                {user.location && (
                                    <p className="text-blue-200 flex items-center mt-1">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {user.location}
                                    </p>
                                )}
                            </>
                        )}

                        {/* Rating */}
                        <div className="flex items-center mt-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${
                                            i < Math.floor(user.rating?.average || 0)
                                                ? 'text-yellow-300'
                                                : 'text-white/30'
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="ml-2 text-blue-100">
                                {user.rating?.average?.toFixed(1) || '0.0'} ({user.rating?.count || 0} reviews)
                            </span>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex space-x-2">
                            {isEditing ? (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Save
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Cancel
                                    </motion.button>
                                </>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm"
                                >
                                    Edit Profile
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Bio */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    {isEditing ? (
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about yourself..."
                        />
                    ) : (
                        <p className="text-gray-600">
                            {user.bio || 'No bio available.'}
                        </p>
                    )}
                </div>

                {/* Skills */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="space-y-3">
                        {(isEditing ? formData.skills : user.skills || []).map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <span className="font-medium text-gray-900">{skill.name}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                                            {skill.level}
                                        </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {skill.category}
                                        </span>
                                    </div>
                                    {skill.description && (
                                        <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => handleSkillRemove(index)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </motion.div>
                        ))}
                        {(isEditing ? formData.skills : user.skills || []).length === 0 && (
                            <p className="text-gray-500 italic">No skills listed yet.</p>
                        )}
                    </div>
                </div>

                {/* Learning Interests */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {(isEditing ? formData.learningInterests : user.learningInterests || []).map((interest, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                                {interest}
                                {isEditing && (
                                    <button
                                        onClick={() => handleInterestRemove(index)}
                                        className="ml-2 text-purple-600 hover:text-purple-800"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </motion.span>
                        ))}
                        {(isEditing ? formData.learningInterests : user.learningInterests || []).length === 0 && (
                            <p className="text-gray-500 italic">No learning interests specified.</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile;
