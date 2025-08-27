import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        // Handle different types of errors
        if (!response) {
            // Network error
            console.error('Network error:', error);
            toast.error('Network error. Please check your connection.');
            return Promise.reject(error);
        }

        const { status, data } = response;

        switch (status) {
            case 400:
                // Bad request
                const message = data?.message || 'Invalid request';
                console.error('Bad request:', data);
                break;

            case 401:
                // Unauthorized - token expired or invalid
                console.error('Unauthorized:', data);
                
                // Clear token and redirect to login
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                
                // Only show toast if it's not a silent request
                if (!error.config?.silent) {
                    toast.error('Session expired. Please sign in again.');
                }
                
                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                break;

            case 403:
                // Forbidden
                console.error('Forbidden:', data);
                toast.error('You don\'t have permission to perform this action.');
                break;

            case 404:
                // Not found
                console.error('Not found:', data);
                if (!error.config?.silent) {
                    toast.error(data?.message || 'Resource not found');
                }
                break;

            case 409:
                // Conflict (e.g., duplicate data)
                console.error('Conflict:', data);
                toast.error(data?.message || 'Conflict occurred');
                break;

            case 422:
                // Validation error
                console.error('Validation error:', data);
                const validationMessage = data?.message || 'Validation failed';
                toast.error(validationMessage);
                break;

            case 429:
                // Too many requests
                console.error('Rate limited:', data);
                toast.error('Too many requests. Please try again later.');
                break;

            case 500:
            case 502:
            case 503:
            case 504:
                // Server errors
                console.error('Server error:', data);
                toast.error('Server error. Please try again later.');
                break;

            default:
                console.error('Unknown error:', data);
                toast.error('An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

// Helper functions for common API calls
export const apiHelpers = {
    // Authentication
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.post('/auth/change-password', data),

    // Skills
    getSkills: (params) => api.get('/skills', { params }),
    getSkill: (id) => api.get(`/skills/${id}`),
    createSkill: (data) => api.post('/skills', data),
    updateSkill: (id, data) => api.put(`/skills/${id}`, data),
    deleteSkill: (id) => api.delete(`/skills/${id}`),
    expressInterest: (id, message) => api.post(`/skills/${id}/interest`, { message }),
    updateInterest: (skillId, interestId, status) => 
        api.put(`/skills/${skillId}/interest/${interestId}`, { status }),
    getUserSkills: (userId, params) => api.get(`/skills/user/${userId}`, { params }),

    // Users
    getUsers: (params) => api.get('/users', { params }),
    getUser: (id) => api.get(`/users/${id}`),
    getUserStats: (id) => api.get(`/users/${id}/stats`),
    followUser: (id) => api.post(`/users/${id}/follow`),
    getUserSuggestions: (query) => api.get('/users/search/suggestions', { params: { q: query } }),

    // Reviews
    createReview: (data) => api.post('/reviews', data),
    getUserReviews: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
    getSkillReviews: (skillId) => api.get(`/reviews/skill/${skillId}`),
    updateReview: (id, data) => api.put(`/reviews/${id}`, data),
    deleteReview: (id) => api.delete(`/reviews/${id}`),
    markReviewHelpful: (id) => api.post(`/reviews/${id}/helpful`),

    // Messages
    getConversations: (params) => api.get('/messages/conversations', { params }),
    getMessages: (conversationId, params) => api.get(`/messages/${conversationId}`, { params }),
    sendMessage: (data) => api.post('/messages', data),
    updateMessage: (id, data) => api.put(`/messages/${id}`, data),
    deleteMessage: (id) => api.delete(`/messages/${id}`),
    reactToMessage: (id, emoji) => api.post(`/messages/${id}/react`, { emoji }),

    // File uploads
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadDocument: (file) => {
        const formData = new FormData();
        formData.append('document', file);
        return api.post('/upload/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadMultipleFiles: (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteFile: (filename) => api.delete(`/upload/${filename}`)
};

// Utility function to handle file uploads with progress
export const uploadWithProgress = (endpoint, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(endpoint, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            if (onProgress) {
                onProgress(percentCompleted);
            }
        },
    });
};

// Utility function for paginated requests
export const getPaginated = async (endpoint, params = {}) => {
    try {
        const response = await api.get(endpoint, { params });
        return {
            data: response.data,
            pagination: response.data.pagination || {},
        };
    } catch (error) {
        throw error;
    }
};

// Utility function for silent requests (no error toasts)
export const silentRequest = (config) => {
    return api({
        ...config,
        silent: true
    });
};

// Health check function
export const healthCheck = () => api.get('/health');

export { api };
export default api;
