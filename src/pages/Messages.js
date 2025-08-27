import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner';
import MessageThread from '../components/MessageThread';

const Messages = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            loadConversations();
            
            // Check if there's a conversation ID in URL
            const conversationId = searchParams.get('conversation');
            if (conversationId) {
                setSelectedConversation({ conversationId });
                loadMessages(conversationId);
            }
        }
    }, [user, searchParams]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/messages/conversations');
            setConversations(response.data.conversations);
        } catch (error) {
            console.error('Failed to load conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (conversationId, page = 1) => {
        try {
            setMessagesLoading(true);
            const response = await api.get(`/messages/${conversationId}?page=${page}&limit=50`);
            
            if (page === 1) {
                setMessages(response.data.messages);
            } else {
                setMessages(prev => [...response.data.messages, ...prev]);
            }
            
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to load messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        setMessages([]);
        
        // Update URL
        const newSearchParams = new URLSearchParams();
        newSearchParams.set('conversation', conversation.conversationId);
        setSearchParams(newSearchParams);
        
        loadMessages(conversation.conversationId);
    };

    const handleSendMessage = async (messageData) => {
        try {
            const response = await api.post('/messages', messageData);
            
            // Add new message to the list
            setMessages(prev => [...prev, response.data.data]);
            
            // Update conversation in sidebar (move to top and update last message)
            setConversations(prev => {
                const updated = prev.filter(c => c.conversationId !== selectedConversation.conversationId);
                return [{
                    ...selectedConversation,
                    lastMessage: {
                        content: messageData.content,
                        timestamp: new Date().toISOString(),
                        isOwn: true
                    },
                    unreadCount: 0
                }, ...updated];
            });
            
            toast.success('Message sent!');
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
            throw error;
        }
    };

    const handleLoadMoreMessages = () => {
        if (selectedConversation && pagination.page < pagination.pages) {
            loadMessages(selectedConversation.conversationId, pagination.page + 1);
        }
    };

    const filteredConversations = conversations.filter(conversation => {
        if (!searchQuery) return true;
        
        const participantName = `${conversation.participant.firstName} ${conversation.participant.lastName}`.toLowerCase();
        const username = conversation.participant.username.toLowerCase();
        const lastMessage = conversation.lastMessage.content.toLowerCase();
        
        return participantName.includes(searchQuery.toLowerCase()) ||
               username.includes(searchQuery.toLowerCase()) ||
               lastMessage.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex h-screen">
                    {/* Conversations Sidebar */}
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        className="w-1/3 border-r border-gray-200 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <h1 className="text-xl font-semibold text-gray-900 mb-4">Messages</h1>
                            
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="flex-1">
                                                <SkeletonLoader lines={2} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        {searchQuery ? 'No conversations found' : 'No messages yet'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery 
                                            ? 'Try searching for a different name or keyword.'
                                            : 'Start conversations by expressing interest in skills or connecting with other users.'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredConversations.map((conversation, index) => (
                                        <motion.button
                                            key={conversation.conversationId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ backgroundColor: '#f9fafb' }}
                                            onClick={() => handleConversationSelect(conversation)}
                                            className={`w-full p-4 text-left transition-colors ${
                                                selectedConversation?.conversationId === conversation.conversationId
                                                    ? 'bg-blue-50 border-r-2 border-blue-500'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <img
                                                        src={conversation.participant.profilePicture || 
                                                            `https://ui-avatars.com/api/?name=${conversation.participant.firstName}+${conversation.participant.lastName}&background=6366f1&color=fff&size=48`}
                                                        alt={conversation.participant.firstName}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {conversation.unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-0">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {conversation.participant.firstName} {conversation.participant.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {conversation.lastMessage.isOwn && "You: "}
                                                        {conversation.lastMessage.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Message Thread */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1"
                    >
                        <MessageThread
                            conversation={selectedConversation}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onLoadMore={handleLoadMoreMessages}
                            hasMore={pagination.page < pagination.pages}
                            loading={messagesLoading}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
