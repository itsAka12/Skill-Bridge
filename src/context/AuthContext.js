import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setInitialized(true);
                setLoading(false);
                return;
            }

            // Set the token for API requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Validate token and get user data
            const response = await api.get('/auth/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setInitialized(true);
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            const { token, user: userData } = response.data;
            
            // Store token
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Set user data
            setUser(userData);
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            
            const { token, user: newUser } = response.data;
            
            // Store token
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Set user data
            setUser(newUser);
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        // Clear token and user data
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(prev => ({
            ...prev,
            ...updatedUser
        }));
    };

    const refreshUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // If refresh fails, logout user
            logout();
            throw error;
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/auth/profile', profileData);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    // Check if user has specific role or permission
    const hasPermission = (permission) => {
        if (!user) return false;
        // Add permission logic here if needed
        return true;
    };

    const value = {
        user,
        loading: loading && !initialized,
        initialized,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        changePassword,
        updateProfile,
        isAuthenticated,
        hasPermission
    };

    // Show loading spinner during initial auth check
    if (loading && !initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                            <span className="text-white font-bold text-lg">SB</span>
                        </div>
                    </div>
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Loading SkillBridge...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
    return function AuthenticatedComponent(props) {
        const { user, loading } = useAuth();

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            );
        }

        if (!user) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
                        <a
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default AuthContext;
