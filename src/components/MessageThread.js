import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const MessageThread = ({ conversation, messages, onSendMessage, onLoadMore, hasMore, loading }) => {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageText = newMessage.trim();
        setNewMessage('');
        setIsTyping(true);

        try {
            await onSendMessage({
                recipient: conversation.participant.id,
                content: messageText,
                messageType: 'text'
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container && container.scrollTop === 0 && hasMore && !loading) {
            onLoadMore();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    };

    const renderMessage = (message) => {
        const isOwn = message.sender._id === user.id;
        const showAvatar = !isOwn;

        return (
            <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
            >
                <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
                    {showAvatar && (
                        <img
                            src={message.sender.profilePicture || 
                                `https://ui-avatars.com/api/?name=${message.sender.firstName}+${message.sender.lastName}&background=6366f1&color=fff&size=32`}
                            alt={message.sender.firstName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    )}
                    
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative px-4 py-2 rounded-lg ${
                            isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                        {/* Message Content */}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Timestamp */}
                        <p className={`text-xs mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                            {formatTime(message.createdAt)}
                            {message.isEdited && (
                                <span className="ml-1">(edited)</span>
                            )}
                        </p>

                        {/* Message Type Indicator */}
                        {message.messageType !== 'text' && (
                            <div className={`text-xs mt-1 flex items-center ${
                                isOwn ? 'text-blue-200' : 'text-gray-400'
                            }`}>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 3 3-3m-6 0V9" />
                                </svg>
                                {message.messageType}
                            </div>
                        )}

                        {/* Read Status */}
                        {isOwn && message.readBy && message.readBy.length > 0 && (
                            <div className="text-xs text-blue-200 mt-1">
                                Read
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        );
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Choose a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={conversation.participant.profilePicture || 
                            `https://ui-avatars.com/api/?name=${conversation.participant.firstName}+${conversation.participant.lastName}&background=6366f1&color=fff&size=40`}
                        alt={conversation.participant.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {conversation.participant.firstName} {conversation.participant.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">@{conversation.participant.username}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-1"
            >
                {loading && (
                    <div className="flex justify-center py-4">
                        <LoadingSpinner size="sm" />
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">No messages yet</p>
                            <p className="text-xs text-gray-400">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map(renderMessage)}
                    </AnimatePresence>
                )}

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex justify-start"
                    >
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white px-6 py-4">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message ${conversation.participant.firstName}...`}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isTyping}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={!newMessage.trim() || isTyping}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                        {isTyping ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <>
                                <span>Send</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default MessageThread;
