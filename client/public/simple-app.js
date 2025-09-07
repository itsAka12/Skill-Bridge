// Simple React App for SkillBridge
const { useState, useEffect } = React;

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  // Navigation function
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Login function
  const login = (userData) => {
    setUser(userData);
    navigateTo('dashboard');
  };

  // Logout function  
  const logout = () => {
    setUser(null);
    navigateTo('home');
  };

  // Navbar Component
  const Navbar = () => (
    React.createElement('nav', { className: 'bg-white shadow-lg' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4' },
        React.createElement('div', { className: 'flex justify-between items-center h-16' },
          React.createElement('div', { className: 'flex items-center' },
            React.createElement('button', { 
              onClick: () => navigateTo('home'),
              className: 'text-2xl font-bold text-indigo-600 hover:text-indigo-700'
            }, 'SkillBridge')
          ),
          React.createElement('div', { className: 'hidden md:flex space-x-8' },
            React.createElement('button', {
              onClick: () => navigateTo('skills'),
              className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
            }, 'Browse Skills'),
            user ? [
              React.createElement('button', {
                key: 'dashboard',
                onClick: () => navigateTo('dashboard'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Dashboard'),
              React.createElement('button', {
                key: 'messages',
                onClick: () => navigateTo('messages'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Messages'),
              React.createElement('button', {
                key: 'notifications',
                onClick: () => navigateTo('notifications'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Notifications'),
              React.createElement('button', {
                key: 'profile',
                onClick: () => navigateTo('profile'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Profile'),
              React.createElement('button', {
                key: 'settings',
                onClick: () => navigateTo('settings'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Settings'),
              React.createElement('button', {
                key: 'logout',
                onClick: logout,
                className: 'text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium'
              }, 'Logout')
            ] : [
              React.createElement('button', {
                key: 'login',
                onClick: () => navigateTo('login'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Login'),
              React.createElement('button', {
                key: 'register',
                onClick: () => navigateTo('register'),
                className: 'bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700'
              }, 'Sign Up')
            ]
          )
        )
      )
    )
  );

  // Home Page Component
  const HomePage = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'UX Designer',
        content: 'SkillBridge helped me learn React development from amazing mentors. The peer-to-peer learning approach is incredibly effective!',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff'
      },
      {
        name: 'Mike Chen',
        role: 'Marketing Manager',
        content: 'I taught digital marketing while learning web development. It\'s amazing how teaching others reinforces your own knowledge.',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=8b5cf6&color=fff'
      },
      {
        name: 'Emma Rodriguez',
        role: 'Freelance Writer',
        content: 'The community here is incredibly supportive. I\'ve made lasting connections and learned skills that transformed my career.',
        avatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=10b981&color=fff'
      }
    ];

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50' },
      // Hero Section with Enhanced Animations
      React.createElement('div', { className: 'relative overflow-hidden' },
        // Animated Background Elements
        React.createElement('div', { className: 'absolute inset-0' },
          React.createElement('div', { className: 'absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob' }),
          React.createElement('div', { className: 'absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000' }),
          React.createElement('div', { className: 'absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000' })
        ),
        
        React.createElement('div', { className: 'max-w-7xl mx-auto relative z-10' },
          React.createElement('div', { className: 'relative pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32' },
            React.createElement('main', { className: 'mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28' },
              React.createElement('div', { className: 'sm:text-center lg:text-left' },
                React.createElement('h1', { 
                  className: `text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
                },
                  React.createElement('span', { className: 'block xl:inline' }, 'Connect, Learn,'),
                  ' ',
                  React.createElement('span', { className: 'block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 xl:inline' }, 'and Grow Together')
                ),
                React.createElement('p', { 
                  className: `mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
                },
                  'SkillBridge connects passionate learners with skilled teachers worldwide. Share your expertise, discover new skills, and grow through meaningful peer-to-peer exchanges.'
                ),
                React.createElement('div', { 
                  className: `mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}` 
                },
                  React.createElement('div', { className: 'rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300' },
                    React.createElement('button', {
                      onClick: () => navigateTo(user ? 'dashboard' : 'register'),
                      className: 'w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10'
                    }, 
                      React.createElement('span', { className: 'mr-2' }, user ? '🚀' : '✨'),
                      user ? 'Go to Dashboard' : 'Get Started'
                    )
                  ),
                  React.createElement('div', { className: 'mt-3 sm:mt-0 sm:ml-3' },
                    React.createElement('button', {
                      onClick: () => navigateTo('skills'),
                      className: 'w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transform hover:scale-105 transition-all duration-200 md:py-4 md:text-lg md:px-10'
                    }, 
                      React.createElement('span', { className: 'mr-2' }, '🔍'),
                      'Browse Skills'
                    )
                  )
                )
              )
            )
          )
        )
      ),
      
      // Enhanced Features Section
      React.createElement('div', { className: 'py-20 bg-white' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
          React.createElement('div', { className: 'lg:text-center' },
            React.createElement('h2', { className: 'text-base text-indigo-600 font-semibold tracking-wide uppercase' }, 'Features'),
            React.createElement('p', { className: 'mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl' },
              'Everything you need to exchange skills'
            )
          ),
          
          React.createElement('div', { className: 'mt-16' },
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' },
              // Feature 1
              React.createElement('div', { className: 'group relative bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2' },
                React.createElement('div', { className: 'flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300' },
                  React.createElement('span', { className: 'text-2xl' }, '🎯')
                ),
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Smart Matching'),
                React.createElement('p', { className: 'text-gray-600' },
                  'AI-powered matching connects you with the perfect learning partners based on skills and interests.'
                )
              ),
              
              // Feature 2  
              React.createElement('div', { className: 'group relative bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2' },
                React.createElement('div', { className: 'flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300' },
                  React.createElement('span', { className: 'text-2xl' }, '💬')
                ),
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Real-time Chat'),
                React.createElement('p', { className: 'text-gray-600' },
                  'Seamless communication with video calls, file sharing, and instant messaging.'
                )
              ),
              
              // Feature 3
              React.createElement('div', { className: 'group relative bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2' },
                React.createElement('div', { className: 'flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300' },
                  React.createElement('span', { className: 'text-2xl' }, '⭐')
                ),
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Trust System'),
                React.createElement('p', { className: 'text-gray-600' },
                  'Build reputation through reviews, ratings, and verified skill assessments.'
                )
              ),
              
              // Feature 4
              React.createElement('div', { className: 'group relative bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2' },
                React.createElement('div', { className: 'flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300' },
                  React.createElement('span', { className: 'text-2xl' }, '🌍')
                ),
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Global Network'),
                React.createElement('p', { className: 'text-gray-600' },
                  'Connect with learners and teachers from around the world in our vibrant community.'
                )
              )
            )
          )
        )
      ),

      // Interactive Testimonials Section
      React.createElement('div', { className: 'py-20 bg-gradient-to-r from-indigo-50 to-purple-50' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
          React.createElement('div', { className: 'text-center mb-16' },
            React.createElement('h2', { className: 'text-3xl md:text-4xl font-bold text-gray-900 mb-4' },
              'What Our Community Says'
            ),
            React.createElement('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto' },
              'Join thousands of learners and teachers who are transforming their skills'
            )
          ),
          
          React.createElement('div', { className: 'relative max-w-4xl mx-auto' },
            React.createElement('div', { className: 'bg-white rounded-2xl shadow-xl p-8 min-h-64' },
              React.createElement('div', { className: 'flex items-center mb-6' },
                React.createElement('img',
                  { 
                    src: testimonials[currentTestimonial].avatar,
                    alt: testimonials[currentTestimonial].name,
                    className: 'w-16 h-16 rounded-full mr-4'
                  }
                ),
                React.createElement('div', null,
                  React.createElement('h4', { className: 'font-semibold text-gray-900 text-lg' }, testimonials[currentTestimonial].name),
                  React.createElement('p', { className: 'text-sm text-gray-600' }, testimonials[currentTestimonial].role)
                )
              ),
              React.createElement('p', { className: 'text-gray-700 text-lg italic leading-relaxed' },
                `"${testimonials[currentTestimonial].content}"`
              ),
              React.createElement('div', { className: 'flex text-yellow-400 mt-4' },
                [...Array(5)].map((_, i) => 
                  React.createElement('svg', { key: i, className: 'w-5 h-5', fill: 'currentColor', viewBox: '0 0 20 20' },
                    React.createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
                  )
                )
              )
            ),
            
            // Testimonial Navigation Dots
            React.createElement('div', { className: 'flex justify-center mt-6 space-x-2' },
              testimonials.map((_, index) => 
                React.createElement('button', {
                  key: index,
                  onClick: () => setCurrentTestimonial(index),
                  className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-indigo-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`
                })
              )
            )
          )
        )
      ),

      // Stats Section
      React.createElement('div', { className: 'py-20 bg-white' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-8' },
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-4xl font-bold text-indigo-600 mb-2' }, '10K+'),
              React.createElement('p', { className: 'text-gray-600' }, 'Active Users')
            ),
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-4xl font-bold text-purple-600 mb-2' }, '50K+'),
              React.createElement('p', { className: 'text-gray-600' }, 'Skills Shared')
            ),
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-4xl font-bold text-green-600 mb-2' }, '100+'),
              React.createElement('p', { className: 'text-gray-600' }, 'Countries')
            ),
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-4xl font-bold text-orange-600 mb-2' }, '4.9★'),
              React.createElement('p', { className: 'text-gray-600' }, 'Average Rating')
            )
          )
        )
      )
    )
              };

  // Login Page Component
  const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (formData.email && formData.password) {
        // Simulate successful login
        login({
          id: '1',
          username: 'demo_user',
          firstName: 'Demo',
          lastName: 'User',
          email: formData.email
        });
        setError('');
      } else {
        setError('Please fill in all fields');
      }
    };

    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8' },
      React.createElement('div', { className: 'max-w-md w-full space-y-8' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'mt-6 text-center text-3xl font-extrabold text-gray-900' },
            'Sign in to SkillBridge'
          )
        ),
        React.createElement('form', { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
          error && React.createElement('div', { className: 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded' },
            error
          ),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Email'),
              React.createElement('input', {
                type: 'email',
                required: true,
                value: formData.email,
                onChange: (e) => setFormData({...formData, email: e.target.value}),
                className: 'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                placeholder: 'your@email.com'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Password'),
              React.createElement('input', {
                type: 'password',
                required: true,
                value: formData.password,
                onChange: (e) => setFormData({...formData, password: e.target.value}),
                className: 'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500',
                placeholder: 'Password'
              })
            )
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }, 'Sign in'),
          React.createElement('div', { className: 'text-center' },
            React.createElement('button', {
              type: 'button',
              onClick: () => navigateTo('register'),
              className: 'text-indigo-600 hover:text-indigo-500'
            }, "Don't have an account? Sign up")
          )
        )
      )
    );
  };

  // Register Page Component  
  const RegisterPage = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.firstName && formData.lastName && formData.email && formData.password) {
        login({
          id: '1',
          username: formData.firstName.toLowerCase(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
      }
    };

    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8' },
      React.createElement('div', { className: 'max-w-md w-full space-y-8' },
        React.createElement('h2', { className: 'mt-6 text-center text-3xl font-extrabold text-gray-900' },
          'Join SkillBridge'
        ),
        React.createElement('form', { className: 'mt-8 space-y-6', onSubmit: handleSubmit },
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'First Name'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: formData.firstName,
                  onChange: (e) => setFormData({...formData, firstName: e.target.value}),
                  className: 'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Last Name'),
                React.createElement('input', {
                  type: 'text',
                  required: true,
                  value: formData.lastName,
                  onChange: (e) => setFormData({...formData, lastName: e.target.value}),
                  className: 'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                })
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Email'),
              React.createElement('input', {
                type: 'email',
                required: true,
                value: formData.email,
                onChange: (e) => setFormData({...formData, email: e.target.value}),
                className: 'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700' }, 'Password'),
              React.createElement('input', {
                type: 'password',
                required: true,
                value: formData.password,
                onChange: (e) => setFormData({...formData, password: e.target.value}),
                className: 'mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              })
            )
          ),
          React.createElement('button', {
            type: 'submit',
            className: 'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
          }, 'Create Account'),
          React.createElement('div', { className: 'text-center' },
            React.createElement('button', {
              type: 'button',
              onClick: () => navigateTo('login'),
              className: 'text-indigo-600 hover:text-indigo-500'
            }, 'Already have an account? Sign in')
          )
        )
      )
    );
  };

  // Skills Page Component
  const SkillsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSkill, setNewSkill] = useState({
      title: '',
      description: '',
      category: '',
      level: '',
      skillType: 'Offering'
    });

    const skills = [
      {
        id: '1',
        title: 'JavaScript Programming',
        description: 'Learn modern JavaScript from basics to advanced concepts including ES6+, async/await, and frameworks.',
        category: 'Technology',
        level: 'Intermediate',
        skillType: 'Offering',
        provider: { firstName: 'John', lastName: 'Doe', rating: 4.8 },
        tags: ['javascript', 'programming', 'web development'],
        createdAt: '2024-01-15',
        interestCount: 23
      },
      {
        id: '2', 
        title: 'Guitar Lessons',
        description: 'Acoustic and electric guitar lessons for beginners. Learn chords, strumming patterns, and popular songs.',
        category: 'Music',
        level: 'Beginner',
        skillType: 'Offering',
        provider: { firstName: 'Jane', lastName: 'Smith', rating: 4.9 },
        tags: ['guitar', 'music', 'instruments'],
        createdAt: '2024-01-10',
        interestCount: 15
      },
      {
        id: '3',
        title: 'Digital Photography',
        description: 'Master the art of digital photography including composition, lighting, and post-processing techniques.',
        category: 'Arts',
        level: 'Intermediate',
        skillType: 'Offering',
        provider: { firstName: 'Mike', lastName: 'Johnson', rating: 4.7 },
        tags: ['photography', 'camera', 'editing'],
        createdAt: '2024-01-08',
        interestCount: 31
      },
      {
        id: '4',
        title: 'React Development',
        description: 'Learn React.js from fundamentals to advanced patterns. Build modern web applications with hooks and context.',
        category: 'Technology',
        level: 'Advanced',
        skillType: 'Seeking',
        provider: { firstName: 'Sarah', lastName: 'Wilson', rating: 4.6 },
        tags: ['react', 'frontend', 'javascript'],
        createdAt: '2024-01-12',
        interestCount: 8
      },
      {
        id: '5',
        title: 'Spanish Language',
        description: 'Practice conversational Spanish with native speakers. Improve your fluency through real conversations.',
        category: 'Languages',
        level: 'Beginner',
        skillType: 'Seeking',
        provider: { firstName: 'Carlos', lastName: 'Rodriguez', rating: 4.9 },
        tags: ['spanish', 'language', 'conversation'],
        createdAt: '2024-01-05',
        interestCount: 19
      },
      {
        id: '6',
        title: 'Graphic Design',
        description: 'Learn Adobe Creative Suite, design principles, and create stunning visuals for print and digital media.',
        category: 'Design',
        level: 'Intermediate',
        skillType: 'Offering',
        provider: { firstName: 'Emma', lastName: 'Davis', rating: 4.8 },
        tags: ['design', 'adobe', 'creative'],
        createdAt: '2024-01-14',
        interestCount: 27
      }
    ];

    const categories = ['All', 'Technology', 'Design', 'Music', 'Arts', 'Languages', 'Business', 'Health', 'Sports', 'Other'];
    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const sortOptions = [
      { value: 'newest', label: 'Newest First' },
      { value: 'oldest', label: 'Oldest First' },
      { value: 'popular', label: 'Most Popular' },
      { value: 'rating', label: 'Highest Rated' }
    ];

    const filteredSkills = skills.filter(skill => {
      const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || skill.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    const sortedSkills = [...filteredSkills].sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return b.interestCount - a.interestCount;
        case 'rating':
          return b.provider.rating - a.provider.rating;
        default:
          return 0;
      }
    });

    const handleCreateSkill = () => {
      if (newSkill.title && newSkill.description && newSkill.category && newSkill.level) {
        // In a real app, this would make an API call
        console.log('Creating skill:', newSkill);
        setShowCreateModal(false);
        setNewSkill({ title: '', description: '', category: '', level: '', skillType: 'Offering' });
        // Show success message
        alert('Skill created successfully!');
      }
    };

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        // Header Section
        React.createElement('div', { className: 'text-center mb-12' },
          React.createElement('h1', { className: 'text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4' },
            React.createElement('span', { className: 'gradient-text' }, 'Browse Skills')
          ),
          React.createElement('p', { className: 'text-xl text-gray-600 max-w-3xl mx-auto' },
            'Discover amazing skills to learn or find people to teach. Connect with passionate learners and teachers worldwide.'
          )
        ),

        // Advanced Filters Section
        React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-6 mb-8' },
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6' },
            // Search Input
            React.createElement('div', { className: 'lg:col-span-2' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Search Skills'),
              React.createElement('div', { className: 'relative' },
                React.createElement('input',
                  {
                    type: 'text',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    placeholder: 'Search by title, description, or tags...',
                    className: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  }
                ),
                React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                  React.createElement('svg', { className: 'h-5 w-5 text-gray-400', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                  )
                )
              )
            ),

            // Category Filter
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Category'),
              React.createElement('select',
                {
                  value: selectedCategory,
                  onChange: (e) => setSelectedCategory(e.target.value),
                  className: 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                },
                categories.map(category => 
                  React.createElement('option', { key: category, value: category }, category)
                )
              )
            ),

            // Level Filter
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Level'),
              React.createElement('select',
                {
                  value: selectedLevel,
                  onChange: (e) => setSelectedLevel(e.target.value),
                  className: 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                },
                levels.map(level => 
                  React.createElement('option', { key: level, value: level }, level)
                )
              )
            )
          ),

          // Sort and Create Button Row
          React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-center gap-4' },
            React.createElement('div', { className: 'flex items-center gap-4' },
              React.createElement('label', { className: 'text-sm font-medium text-gray-700' }, 'Sort by:'),
              React.createElement('select',
                {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  className: 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                },
                sortOptions.map(option => 
                  React.createElement('option', { key: option.value, value: option.value }, option.label)
                )
              )
            ),
            React.createElement('button',
              {
                onClick: () => setShowCreateModal(true),
                className: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
              },
              React.createElement('span', { className: 'mr-2' }, '✨'),
              'Share a Skill'
            )
          )
        ),

        // Results Count
        React.createElement('div', { className: 'mb-6' },
          React.createElement('p', { className: 'text-gray-600' },
            `Showing ${sortedSkills.length} of ${skills.length} skills`
          )
        ),

        // Skills Grid
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          sortedSkills.map((skill, index) => 
            React.createElement('div', { 
              key: skill.id,
              className: 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group'
            },
              React.createElement('div', { className: 'p-6' },
                // Skill Type Badge
                React.createElement('div', { className: 'flex justify-between items-start mb-4' },
                  React.createElement('span', { 
                    className: `px-3 py-1 text-xs font-medium rounded-full ${
                      skill.skillType === 'Offering' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }` 
                  }, skill.skillType),
                  React.createElement('div', { className: 'flex items-center text-yellow-400' },
                    [...Array(5)].map((_, i) => 
                      React.createElement('svg', { 
                        key: i, 
                        className: `w-4 h-4 ${i < Math.floor(skill.provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`, 
                        fill: 'currentColor', 
                        viewBox: '0 0 20 20' 
                      },
                        React.createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
                      )
                    ),
                    React.createElement('span', { className: 'ml-1 text-sm text-gray-600' }, skill.provider.rating)
                  )
                ),

                // Title and Description
                React.createElement('h3', { className: 'text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors' }, skill.title),
                React.createElement('p', { className: 'text-gray-600 mb-4 line-clamp-3' }, skill.description),

                // Tags
                React.createElement('div', { className: 'flex flex-wrap gap-2 mb-4' },
                  skill.tags.slice(0, 3).map(tag => 
                    React.createElement('span', { 
                      key: tag,
                      className: 'px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full' 
                    }, `#${tag}`)
                  )
                ),

                // Category and Level
                React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                  React.createElement('span', { className: 'px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full' },
                    skill.category
                  ),
                  React.createElement('span', { className: 'px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full' },
                    skill.level
                  )
                ),

                // Provider Info and Interest Count
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('div', { className: 'w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium' },
                      skill.provider.firstName[0]
                    ),
                    React.createElement('div', { className: 'ml-3' },
                      React.createElement('p', { className: 'text-sm font-medium text-gray-900' },
                        `${skill.provider.firstName} ${skill.provider.lastName}`
                      ),
                      React.createElement('p', { className: 'text-xs text-gray-500' },
                        new Date(skill.createdAt).toLocaleDateString()
                      )
                    )
                  ),
                  React.createElement('div', { className: 'text-right' },
                    React.createElement('p', { className: 'text-sm font-medium text-gray-900' }, skill.interestCount),
                    React.createElement('p', { className: 'text-xs text-gray-500' }, 'interested')
                  )
                )
              )
            )
          )
        ),

        // Create Skill Modal
        showCreateModal && React.createElement('div', { 
          className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
          onClick: () => setShowCreateModal(false)
        },
          React.createElement('div', { 
            className: 'bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto',
            onClick: (e) => e.stopPropagation()
          },
            React.createElement('div', { className: 'p-6' },
              React.createElement('div', { className: 'flex justify-between items-center mb-6' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Share a Skill'),
                React.createElement('button',
                  {
                    onClick: () => setShowCreateModal(false),
                    className: 'text-gray-400 hover:text-gray-600'
                  },
                  React.createElement('svg', { className: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })
                  )
                )
              ),

              React.createElement('form', { className: 'space-y-6' },
                // Title
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Skill Title *'),
                  React.createElement('input',
                    {
                      type: 'text',
                      value: newSkill.title,
                      onChange: (e) => setNewSkill({...newSkill, title: e.target.value}),
                      placeholder: 'e.g., React.js Development, Guitar Lessons',
                      className: 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    }
                  )
                ),

                // Description
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Description *'),
                  React.createElement('textarea',
                    {
                      value: newSkill.description,
                      onChange: (e) => setNewSkill({...newSkill, description: e.target.value}),
                      rows: 4,
                      placeholder: 'Describe what you\'ll teach or what you want to learn...',
                      className: 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    }
                  )
                ),

                // Category and Level
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                  React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Category *'),
                    React.createElement('select',
                      {
                        value: newSkill.category,
                        onChange: (e) => setNewSkill({...newSkill, category: e.target.value}),
                        className: 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      },
                      React.createElement('option', { value: '' }, 'Select category'),
                      categories.slice(1).map(category => 
                        React.createElement('option', { key: category, value: category }, category)
                      )
                    )
                  ),
                  React.createElement('div', null,
                    React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Level *'),
                    React.createElement('select',
                      {
                        value: newSkill.level,
                        onChange: (e) => setNewSkill({...newSkill, level: e.target.value}),
                        className: 'w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      },
                      React.createElement('option', { value: '' }, 'Select level'),
                      levels.slice(1).map(level => 
                        React.createElement('option', { key: level, value: level }, level)
                      )
                    )
                  )
                ),

                // Skill Type
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-3' }, 'Skill Type *'),
                  React.createElement('div', { className: 'flex space-x-6' },
                    React.createElement('label', { className: 'flex items-center' },
                      React.createElement('input',
                        {
                          type: 'radio',
                          name: 'skillType',
                          value: 'Offering',
                          checked: newSkill.skillType === 'Offering',
                          onChange: (e) => setNewSkill({...newSkill, skillType: e.target.value}),
                          className: 'mr-2'
                        }
                      ),
                      React.createElement('span', null, 'I\'m offering to teach this skill')
                    ),
                    React.createElement('label', { className: 'flex items-center' },
                      React.createElement('input',
                        {
                          type: 'radio',
                          name: 'skillType',
                          value: 'Seeking',
                          checked: newSkill.skillType === 'Seeking',
                          onChange: (e) => setNewSkill({...newSkill, skillType: e.target.value}),
                          className: 'mr-2'
                        }
                      ),
                      React.createElement('span', null, 'I\'m seeking to learn this skill')
                    )
                  )
                ),

                // Submit Buttons
                React.createElement('div', { className: 'flex justify-end space-x-3 pt-6' },
                  React.createElement('button',
                    {
                      type: 'button',
                      onClick: () => setShowCreateModal(false),
                      className: 'px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                    },
                    'Cancel'
                  ),
                  React.createElement('button',
                    {
                      type: 'button',
                      onClick: handleCreateSkill,
                      className: 'px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
                    },
                    'Create Skill'
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    React.createElement('div', { className: 'min-h-screen bg-gray-50 py-8' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'mb-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' },
            `Welcome back, ${user?.firstName}!`
          ),
          React.createElement('p', { className: 'mt-2 text-gray-600' }, 'Manage your skills and connections')
        ),
        
        React.createElement('div', { className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' },
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-md' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'My Skills'),
            React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Share your expertise with others'),
            React.createElement('button', { className: 'bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700' },
              'Add New Skill'
            )
          ),
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-md' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Messages'),
            React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Connect with other learners'),
            React.createElement('button', { className: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700' },
              'View Messages'
            )
          ),
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-md' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Profile'),
            React.createElement('p', { className: 'text-gray-600 mb-4' }, 'Update your information'),
            React.createElement('button', { 
              onClick: () => navigateTo('profile'),
              className: 'bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700' 
            }, 'Edit Profile')
          )
        )
      )
    )
  );

  // Profile Component  
  const ProfilePage = () => (
    React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8' },
      React.createElement('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-8' }, 'Profile'),
        React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
          React.createElement('div', { className: 'flex items-center mb-8' },
            React.createElement('div', { className: 'w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold' },
              `${user?.firstName[0]}${user?.lastName[0]}`
            ),
            React.createElement('div', { className: 'ml-6' },
              React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' },
                `${user?.firstName} ${user?.lastName}`
              ),
              React.createElement('p', { className: 'text-gray-600' }, `@${user?.username}`),
              React.createElement('p', { className: 'text-gray-600' }, user?.email),
              React.createElement('div', { className: 'flex items-center mt-2' },
                React.createElement('div', { className: 'flex text-yellow-400' },
                  [...Array(5)].map((_, i) => 
                    React.createElement('svg', { key: i, className: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' },
                      React.createElement('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
                    )
                  )
                ),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-600' }, '4.8 (23 reviews)')
              )
            )
          ),
          React.createElement('div', { className: 'border-t pt-8' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-6' }, 'Account Information'),
            React.createElement('div', { className: 'grid gap-6 md:grid-cols-2' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'First Name'),
                React.createElement('input', {
                  type: 'text',
                  value: user?.firstName || '',
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Last Name'),
                React.createElement('input', {
                  type: 'text',
                  value: user?.lastName || '',
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Email'),
                React.createElement('input', {
                  type: 'email',
                  value: user?.email || '',
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Bio'),
                React.createElement('textarea', {
                  rows: 3,
                  placeholder: 'Tell us about yourself...',
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                })
              )
            ),
            React.createElement('div', { className: 'mt-8 flex justify-end' },
              React.createElement('button', {
                className: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
              }, 'Update Profile')
            )
          )
        )
      )
    )
  );

  // Notifications Page Component
  const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([
      {
        id: 1,
        type: 'message',
        title: 'New message from John Doe',
        content: 'Hi! I\'m interested in learning JavaScript from you.',
        time: '2 minutes ago',
        read: false,
        icon: '💬'
      },
      {
        id: 2,
        type: 'skill_interest',
        title: 'Someone is interested in your skill',
        content: 'Sarah Wilson expressed interest in your "React Development" skill.',
        time: '1 hour ago',
        read: false,
        icon: '⭐'
      },
      {
        id: 3,
        type: 'review',
        title: 'New review received',
        content: 'Mike Johnson left a 5-star review for your teaching.',
        time: '3 hours ago',
        read: true,
        icon: '🌟'
      },
      {
        id: 4,
        type: 'system',
        title: 'Welcome to SkillBridge!',
        content: 'Complete your profile to get started with skill exchanges.',
        time: '1 day ago',
        read: true,
        icon: '🎉'
      }
    ]);

    const [filter, setFilter] = useState('all');

    const filteredNotifications = notifications.filter(notification => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'read') return notification.read;
      return true;
    });

    const markAsRead = (id) => {
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    };

    const markAllAsRead = () => {
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8' },
      React.createElement('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex justify-between items-center mb-8' },
          React.createElement('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Notifications'),
          React.createElement('button', {
            onClick: markAllAsRead,
            className: 'bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
          }, 'Mark All as Read')
        ),

        // Filter Tabs
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-4 mb-6' },
          React.createElement('div', { className: 'flex space-x-4' },
            React.createElement('button', {
              onClick: () => setFilter('all'),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`
            }, 'All'),
            React.createElement('button', {
              onClick: () => setFilter('unread'),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`
            }, 'Unread'),
            React.createElement('button', {
              onClick: () => setFilter('read'),
              className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`
            }, 'Read')
          )
        ),

        // Notifications List
        React.createElement('div', { className: 'space-y-4' },
          filteredNotifications.map(notification => 
            React.createElement('div', {
              key: notification.id,
              className: `bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                !notification.read ? 'border-l-4 border-indigo-500' : ''
              }`,
              onClick: () => markAsRead(notification.id)
            },
              React.createElement('div', { className: 'flex items-start space-x-4' },
                React.createElement('div', { className: 'text-2xl' }, notification.icon),
                React.createElement('div', { className: 'flex-1' },
                  React.createElement('div', { className: 'flex items-center justify-between' },
                    React.createElement('h3', { 
                      className: `text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`
                    }, notification.title),
                    React.createElement('span', { className: 'text-sm text-gray-500' }, notification.time)
                  ),
                  React.createElement('p', { className: 'text-gray-600 mt-1' }, notification.content),
                  !notification.read && React.createElement('div', { 
                    className: 'w-2 h-2 bg-indigo-500 rounded-full mt-2' 
                  })
                )
              )
            )
          )
        ),

        filteredNotifications.length === 0 && React.createElement('div', { className: 'text-center py-12' },
          React.createElement('div', { className: 'text-6xl mb-4' }, '🔔'),
          React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'No notifications'),
          React.createElement('p', { className: 'text-gray-600' }, 'You\'re all caught up!')
        )
      )
    );
  };

  // Messages Page Component
  const MessagesPage = () => {
    const [conversations, setConversations] = useState([
      {
        id: 1,
        participant: { firstName: 'John', lastName: 'Doe', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff' },
        lastMessage: { content: 'Hi! I\'m interested in learning JavaScript from you.', timestamp: '2 minutes ago' },
        unreadCount: 2
      },
      {
        id: 2,
        participant: { firstName: 'Sarah', lastName: 'Wilson', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=8b5cf6&color=fff' },
        lastMessage: { content: 'Thanks for the great lesson yesterday!', timestamp: '1 hour ago' },
        unreadCount: 0
      },
      {
        id: 3,
        participant: { firstName: 'Mike', lastName: 'Johnson', avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff' },
        lastMessage: { content: 'When can we schedule the next session?', timestamp: '3 hours ago' },
        unreadCount: 1
      }
    ]);

    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
      if (newMessage.trim()) {
        const message = {
          id: Date.now(),
          content: newMessage,
          sender: 'You',
          timestamp: 'Just now',
          isOwn: true
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      }
    };

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50' },
      React.createElement('div', { className: 'max-w-7xl mx-auto' },
        React.createElement('div', { className: 'flex h-screen' },
          // Conversations Sidebar
          React.createElement('div', { className: 'w-1/3 border-r border-gray-200 bg-white flex flex-col' },
            React.createElement('div', { className: 'p-6 border-b border-gray-200' },
              React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 mb-4' }, 'Messages'),
              React.createElement('div', { className: 'relative' },
                React.createElement('input',
                  {
                    type: 'text',
                    placeholder: 'Search conversations...',
                    className: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  }
                ),
                React.createElement('div', { className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none' },
                  React.createElement('svg', { className: 'h-5 w-5 text-gray-400', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                    React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })
                  )
                )
              )
            ),
            React.createElement('div', { className: 'flex-1 overflow-y-auto' },
              React.createElement('div', { className: 'divide-y divide-gray-200' },
                conversations.map(conversation => 
                  React.createElement('div', {
                    key: conversation.id,
                    className: `p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                    }`,
                    onClick: () => setSelectedConversation(conversation)
                  },
                    React.createElement('div', { className: 'flex items-center space-x-3' },
                      React.createElement('img',
                        { src: conversation.participant.avatar, alt: conversation.participant.firstName, className: 'w-12 h-12 rounded-full' }
                      ),
                      React.createElement('div', { className: 'flex-1 min-w-0' },
                        React.createElement('div', { className: 'flex items-center justify-between' },
                          React.createElement('p', { className: 'font-medium text-gray-900 truncate' },
                            `${conversation.participant.firstName} ${conversation.participant.lastName}`
                          ),
                          conversation.unreadCount > 0 && React.createElement('span', { 
                            className: 'bg-indigo-500 text-white text-xs rounded-full px-2 py-1 min-w-0' 
                          }, conversation.unreadCount)
                        ),
                        React.createElement('p', { className: 'text-sm text-gray-500 truncate' },
                          conversation.lastMessage.content
                        ),
                        React.createElement('p', { className: 'text-xs text-gray-400' },
                          conversation.lastMessage.timestamp
                        )
                      )
                    )
                  )
                )
              )
            )
          ),

          // Chat Area
          React.createElement('div', { className: 'flex-1 flex flex-col' },
            selectedConversation ? (
              React.createElement(React.Fragment, null,
                // Chat Header
                React.createElement('div', { className: 'p-6 border-b border-gray-200 bg-white' },
                  React.createElement('div', { className: 'flex items-center space-x-3' },
                    React.createElement('img',
                      { src: selectedConversation.participant.avatar, alt: selectedConversation.participant.firstName, className: 'w-10 h-10 rounded-full' }
                    ),
                    React.createElement('div', null,
                      React.createElement('h2', { className: 'font-semibold text-gray-900' },
                        `${selectedConversation.participant.firstName} ${selectedConversation.participant.lastName}`
                      ),
                      React.createElement('p', { className: 'text-sm text-gray-500' }, 'Online')
                    )
                  )
                ),

                // Messages
                React.createElement('div', { className: 'flex-1 overflow-y-auto p-6 space-y-4' },
                  messages.length === 0 ? (
                    React.createElement('div', { className: 'text-center py-12' },
                      React.createElement('div', { className: 'text-6xl mb-4' }, '💬'),
                      React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'Start a conversation'),
                      React.createElement('p', { className: 'text-gray-600' }, 'Send a message to begin chatting!')
                    )
                  ) : (
                    messages.map(message => 
                      React.createElement('div', {
                        key: message.id,
                        className: `flex ${message.isOwn ? 'justify-end' : 'justify-start'}`
                      },
                        React.createElement('div', { 
                          className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-gray-200 text-gray-900'
                          }` 
                        },
                          React.createElement('p', null, message.content),
                          React.createElement('p', { 
                            className: `text-xs mt-1 ${
                              message.isOwn ? 'text-indigo-100' : 'text-gray-500'
                            }` 
                          }, message.timestamp)
                        )
                      )
                    )
                  )
                ),

                // Message Input
                React.createElement('div', { className: 'p-6 border-t border-gray-200 bg-white' },
                  React.createElement('div', { className: 'flex space-x-4' },
                    React.createElement('input',
                      {
                        type: 'text',
                        value: newMessage,
                        onChange: (e) => setNewMessage(e.target.value),
                        onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(),
                        placeholder: 'Type a message...',
                        className: 'flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      }
                    ),
                    React.createElement('button', {
                      onClick: handleSendMessage,
                      className: 'bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
                    }, 'Send')
                  )
                )
              )
            ) : (
              React.createElement('div', { className: 'flex-1 flex items-center justify-center' },
                React.createElement('div', { className: 'text-center' },
                  React.createElement('div', { className: 'text-6xl mb-4' }, '💬'),
                  React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' }, 'Select a conversation'),
                  React.createElement('p', { className: 'text-gray-600' }, 'Choose a conversation from the sidebar to start messaging')
                )
              )
            )
          )
        )
      )
    );
  };

  // Settings Page Component
  const SettingsPage = () => {
    const [settings, setSettings] = useState({
      emailNotifications: true,
      pushNotifications: true,
      skillRecommendations: true,
      marketingEmails: false,
      profileVisibility: 'public',
      language: 'en',
      timezone: 'UTC'
    });

    const handleSettingChange = (key, value) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    };

    return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8' },
      React.createElement('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-8' }, 'Settings'),

        React.createElement('div', { className: 'space-y-8' },
          // Notification Settings
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-900 mb-6' }, 'Notification Preferences'),
            React.createElement('div', { className: 'space-y-6' },
              React.createElement('div', { className: 'flex items-center justify-between' },
                React.createElement('div', null,
                  React.createElement('h3', { className: 'text-lg font-medium text-gray-900' }, 'Email Notifications'),
                  React.createElement('p', { className: 'text-gray-600' }, 'Receive notifications via email')
                ),
                React.createElement('label', { className: 'relative inline-flex items-center cursor-pointer' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: settings.emailNotifications,
                    onChange: (e) => handleSettingChange('emailNotifications', e.target.checked),
                    className: 'sr-only peer'
                  }),
                  React.createElement('div', { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
                )
              ),
              React.createElement('div', { className: 'flex items-center justify-between' },
                React.createElement('div', null,
                  React.createElement('h3', { className: 'text-lg font-medium text-gray-900' }, 'Push Notifications'),
                  React.createElement('p', { className: 'text-gray-600' }, 'Receive push notifications in your browser')
                ),
                React.createElement('label', { className: 'relative inline-flex items-center cursor-pointer' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: settings.pushNotifications,
                    onChange: (e) => handleSettingChange('pushNotifications', e.target.checked),
                    className: 'sr-only peer'
                  }),
                  React.createElement('div', { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
                )
              ),
              React.createElement('div', { className: 'flex items-center justify-between' },
                React.createElement('div', null,
                  React.createElement('h3', { className: 'text-lg font-medium text-gray-900' }, 'Skill Recommendations'),
                  React.createElement('p', { className: 'text-gray-600' }, 'Get personalized skill recommendations')
                ),
                React.createElement('label', { className: 'relative inline-flex items-center cursor-pointer' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: settings.skillRecommendations,
                    onChange: (e) => handleSettingChange('skillRecommendations', e.target.checked),
                    className: 'sr-only peer'
                  }),
                  React.createElement('div', { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" })
                )
              )
            )
          ),

          // Privacy Settings
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-900 mb-6' }, 'Privacy & Visibility'),
            React.createElement('div', { className: 'space-y-6' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Profile Visibility'),
                React.createElement('select', {
                  value: settings.profileVisibility,
                  onChange: (e) => handleSettingChange('profileVisibility', e.target.value),
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                },
                  React.createElement('option', { value: 'public' }, 'Public - Anyone can see your profile'),
                  React.createElement('option', { value: 'members' }, 'Members Only - Only SkillBridge members can see your profile'),
                  React.createElement('option', { value: 'private' }, 'Private - Only you can see your profile')
                )
              )
            )
          ),

          // Account Settings
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-8' },
            React.createElement('h2', { className: 'text-xl font-semibold text-gray-900 mb-6' }, 'Account Settings'),
            React.createElement('div', { className: 'space-y-6' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Language'),
                React.createElement('select', {
                  value: settings.language,
                  onChange: (e) => handleSettingChange('language', e.target.value),
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                },
                  React.createElement('option', { value: 'en' }, 'English'),
                  React.createElement('option', { value: 'es' }, 'Spanish'),
                  React.createElement('option', { value: 'fr' }, 'French'),
                  React.createElement('option', { value: 'de' }, 'German')
                )
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Timezone'),
                React.createElement('select', {
                  value: settings.timezone,
                  onChange: (e) => handleSettingChange('timezone', e.target.value),
                  className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                },
                  React.createElement('option', { value: 'UTC' }, 'UTC'),
                  React.createElement('option', { value: 'EST' }, 'Eastern Time'),
                  React.createElement('option', { value: 'PST' }, 'Pacific Time'),
                  React.createElement('option', { value: 'GMT' }, 'Greenwich Mean Time')
                )
              )
            )
          ),

          // Danger Zone
          React.createElement('div', { className: 'bg-white rounded-2xl shadow-lg p-8 border border-red-200' },
            React.createElement('h2', { className: 'text-xl font-semibold text-red-600 mb-6' }, 'Danger Zone'),
            React.createElement('div', { className: 'space-y-4' },
              React.createElement('button', {
                className: 'bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
              }, 'Delete Account'),
              React.createElement('p', { className: 'text-sm text-gray-600' }, 'Once you delete your account, there is no going back. Please be certain.')
            )
          ),

          // Save Button
          React.createElement('div', { className: 'flex justify-end' },
            React.createElement('button', {
              className: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
            }, 'Save Settings')
          )
        )
      )
    );
  };

  // Render current page
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return React.createElement(HomePage);
      case 'login':
        return React.createElement(LoginPage);
      case 'register':
        return React.createElement(RegisterPage);
      case 'skills':
        return React.createElement(SkillsPage);
      case 'dashboard':
        return user ? React.createElement(Dashboard) : React.createElement(LoginPage);
      case 'messages':
        return user ? React.createElement(MessagesPage) : React.createElement(LoginPage);
      case 'notifications':
        return user ? React.createElement(NotificationsPage) : React.createElement(LoginPage);
      case 'profile':
        return user ? React.createElement(ProfilePage) : React.createElement(LoginPage);
      case 'settings':
        return user ? React.createElement(SettingsPage) : React.createElement(LoginPage);
      default:
        return React.createElement(HomePage);
    }
  };

  return React.createElement('div', { className: 'App' },
    React.createElement(Navbar),
    renderCurrentPage()
  );
};

// Tailwind CSS is now loaded in the HTML file

// Render the app
ReactDOM.render(React.createElement(App), document.getElementById('root'));

// Hide loading screen after a short delay
setTimeout(() => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }
}, 1000);