# SkillBridge - Peer-to-Peer Skill Exchange Platform

## Overview

SkillBridge is a modern peer-to-peer skill exchange platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform connects passionate learners with skilled teachers worldwide, enabling users to both offer their expertise and seek knowledge in various domains. The application features real-time messaging, comprehensive user profiles, skill listings, review systems, and file upload capabilities for a complete learning ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with functional components and hooks for modern state management
- **Client-side routing** using React Router DOM for single-page application experience
- **Component-based architecture** with reusable UI components (Navbar, SkillCard, UserProfile, MessageThread, etc.)
- **Context API** for global state management, particularly authentication state
- **Form handling** with React Hook Form for efficient form validation and submission
- **Responsive design** using Tailwind CSS utility classes with custom color palettes
- **Animations** powered by Framer Motion for smooth user interactions and page transitions
- **Toast notifications** via React Hot Toast for user feedback

### Backend Architecture
- **Express.js** server with RESTful API design patterns
- **Modular route structure** with separate route files for auth, skills, users, reviews, messages, and uploads
- **Middleware-based authentication** using JWT tokens with Bearer token format
- **Error handling middleware** for centralized error processing and development/production environment distinction
- **CORS configuration** for cross-origin requests with credential support
- **File upload handling** using Multer for memory storage and file type validation

### Database Design
- **MongoDB** with Mongoose ODM for schema definition and data validation
- **Referenced relationships** between User, Skill, Review, and Message models
- **Indexed fields** for performance optimization (conversation IDs, user references)
- **Schema validation** with custom validators, required fields, and length constraints
- **Connection pooling** and reconnection handling for production reliability

### Authentication & Authorization
- **JWT-based authentication** with 30-day token expiration
- **bcrypt password hashing** for secure password storage
- **Protected routes** using auth middleware that validates Bearer tokens
- **User session management** with token storage in localStorage
- **Automatic token validation** on application initialization

### File Management
- **AWS S3 integration** for profile pictures and document uploads
- **Fallback placeholder system** when AWS credentials are not configured
- **File type validation** supporting images (JPEG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX, TXT)
- **File size limits** set to 10MB for uploads
- **Memory storage** using Multer before S3 upload

### Real-time Features
- **Messaging system** with conversation threading and read receipts
- **Message types** supporting text, skill requests, skill responses, and file attachments
- **Pagination** for message history and conversation loading
- **Search functionality** across skills, users, and conversations

## External Dependencies

### Cloud Services
- **AWS S3** - File storage for profile pictures and document uploads
- **MongoDB Atlas** (configurable) - Primary database hosting option

### Third-party Libraries
- **Framer Motion** - Animation library for smooth UI transitions and micro-interactions
- **React Hook Form** - Form validation and submission handling
- **React Hot Toast** - Toast notification system for user feedback
- **Axios** - HTTP client for API communication with interceptors for auth and error handling
- **Tailwind CSS** - Utility-first CSS framework with custom extensions for forms, typography, and aspect ratios

### Development Tools
- **PostCSS** - CSS processing with Autoprefixer for browser compatibility
- **bcryptjs** - Password hashing library for security
- **jsonwebtoken** - JWT token generation and verification
- **CORS** - Cross-origin resource sharing middleware
- **Multer** - File upload middleware for handling multipart/form-data

### API Integrations
- **UI Avatars** - External service for generating default profile pictures
- **Google Fonts** - Web font loading for Inter font family

The architecture emphasizes modularity, security, and scalability while maintaining simplicity for development and deployment. The fallback systems (placeholder uploads, local MongoDB) ensure the application remains functional even without full external service configuration.