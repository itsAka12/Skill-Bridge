# SkillBridge - Peer-to-Peer Skill Exchange Platform

<div align="center">
  <img src="https://ui-avatars.com/api/?name=SkillBridge&background=6366f1&color=fff&size=120&rounded=true" alt="SkillBridge Logo" width="120" height="120">
  
  <h3>Connect, Learn, and Grow Together</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
  [![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-%5E6.0-green)](https://mongodb.com/)
</div>

---

## 🌟 Overview

SkillBridge is a modern, feature-rich peer-to-peer skill exchange platform that connects passionate learners with skilled teachers worldwide. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides a seamless experience for sharing knowledge, discovering new skills, and building meaningful connections through collaborative learning.

### ✨ Key Features

- 🎯 **Skill Sharing**: Create detailed skill listings for teaching or learning
- 👥 **User Profiles**: Comprehensive profiles with skills, reviews, and ratings
- 💬 **Real-time Messaging**: Built-in chat system for seamless communication
- ⭐ **Review System**: Peer reviews and ratings for quality assurance
- 🔍 **Advanced Search**: Filter and search skills by category, level, and type
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt encryption
- ☁️ **File Upload**: AWS S3 integration for profile pictures and documents
- 🎨 **Modern UI**: Beautiful animations with Framer Motion and Tailwind CSS

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Efficient form handling
- **React Hot Toast** - Beautiful notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **AWS SDK** - AWS S3 integration
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **MongoDB Atlas** - Cloud database (recommended)
- **AWS S3** - File storage and CDN
- **Vercel/Netlify** - Frontend deployment
- **Heroku/Railway** - Backend deployment

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillbridge.git
   cd skillbridge
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables template
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Configure Environment Variables**
   
   Update the `.env` file with your settings:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/skillbridge
   
   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   
   # AWS S3 (optional, for file uploads)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=skillbridge-uploads
   
   # App Settings
   NODE_ENV=development
   PORT=8000
   FRONTEND_URL=http://localhost:5000
   ```

5. **Start the Application**
   ```bash
   # Start backend server (runs on port 8000)
   npm run server
   
   # In a new terminal, start frontend (runs on port 5000)
   npm run client
   
   # Or start both concurrently
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:8000/api
   - API Health Check: http://localhost:8000/api/health

---

## 📁 Project Structure

