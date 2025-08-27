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
                key: 'profile',
                onClick: () => navigateTo('profile'),
                className: 'text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium'
              }, 'Profile'),
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
  const HomePage = () => (
    React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50' },
      // Hero Section
      React.createElement('div', { className: 'relative overflow-hidden' },
        React.createElement('div', { className: 'max-w-7xl mx-auto' },
          React.createElement('div', { className: 'relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32' },
            React.createElement('main', { className: 'mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28' },
              React.createElement('div', { className: 'sm:text-center lg:text-left' },
                React.createElement('h1', { className: 'text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl' },
                  React.createElement('span', { className: 'block xl:inline' }, 'Connect, Learn,'),
                  ' ',
                  React.createElement('span', { className: 'block text-indigo-600 xl:inline' }, 'and Grow Together')
                ),
                React.createElement('p', { className: 'mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0' },
                  'SkillBridge connects passionate learners with skilled teachers worldwide. Share your expertise, discover new skills, and grow through meaningful peer-to-peer exchanges.'
                ),
                React.createElement('div', { className: 'mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start' },
                  React.createElement('div', { className: 'rounded-md shadow' },
                    React.createElement('button', {
                      onClick: () => navigateTo(user ? 'dashboard' : 'register'),
                      className: 'w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
                    }, user ? 'Go to Dashboard' : 'Get Started')
                  ),
                  React.createElement('div', { className: 'mt-3 sm:mt-0 sm:ml-3' },
                    React.createElement('button', {
                      onClick: () => navigateTo('skills'),
                      className: 'w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10'
                    }, 'Browse Skills')
                  )
                )
              )
            )
          )
        )
      ),
      
      // Features Section
      React.createElement('div', { className: 'py-12 bg-white' },
        React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
          React.createElement('div', { className: 'lg:text-center' },
            React.createElement('h2', { className: 'text-base text-indigo-600 font-semibold tracking-wide uppercase' }, 'Features'),
            React.createElement('p', { className: 'mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl' },
              'Everything you need to exchange skills'
            )
          ),
          
          React.createElement('div', { className: 'mt-10' },
            React.createElement('dl', { className: 'space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10' },
              // Feature 1
              React.createElement('div', { className: 'relative' },
                React.createElement('dt', null,
                  React.createElement('div', { className: 'absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white' },
                    React.createElement('span', { className: 'text-2xl' }, '🎯')
                  ),
                  React.createElement('p', { className: 'ml-16 text-lg leading-6 font-medium text-gray-900' }, 'Skill Matching')
                ),
                React.createElement('dd', { className: 'mt-2 ml-16 text-base text-gray-500' },
                  'Connect with the right people based on complementary skills and interests.'
                )
              ),
              
              // Feature 2  
              React.createElement('div', { className: 'relative' },
                React.createElement('dt', null,
                  React.createElement('div', { className: 'absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white' },
                    React.createElement('span', { className: 'text-2xl' }, '💬')
                  ),
                  React.createElement('p', { className: 'ml-16 text-lg leading-6 font-medium text-gray-900' }, 'Real-time Messaging')
                ),
                React.createElement('dd', { className: 'mt-2 ml-16 text-base text-gray-500' },
                  'Communicate seamlessly with your learning partners through our integrated messaging system.'
                )
              ),
              
              // Feature 3
              React.createElement('div', { className: 'relative' },
                React.createElement('dt', null,
                  React.createElement('div', { className: 'absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white' },
                    React.createElement('span', { className: 'text-2xl' }, '⭐')
                  ),
                  React.createElement('p', { className: 'ml-16 text-lg leading-6 font-medium text-gray-900' }, 'Reviews & Ratings')
                ),
                React.createElement('dd', { className: 'mt-2 ml-16 text-base text-gray-500' },
                  'Build trust through transparent reviews and ratings from your skill exchange partners.'
                )
              ),
              
              // Feature 4
              React.createElement('div', { className: 'relative' },
                React.createElement('dt', null,
                  React.createElement('div', { className: 'absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white' },
                    React.createElement('span', { className: 'text-2xl' }, '🌍')
                  ),
                  React.createElement('p', { className: 'ml-16 text-lg leading-6 font-medium text-gray-900' }, 'Global Community')
                ),
                React.createElement('dd', { className: 'mt-2 ml-16 text-base text-gray-500' },
                  'Join a worldwide community of learners and teachers passionate about knowledge sharing.'
                )
              )
            )
          )
        )
      )
    )
  );

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
    const skills = [
      {
        id: '1',
        title: 'JavaScript Programming',
        description: 'Learn modern JavaScript from basics to advanced concepts including ES6+, async/await, and frameworks.',
        category: 'Programming',
        level: 'Intermediate',
        provider: { firstName: 'John', lastName: 'Doe' }
      },
      {
        id: '2', 
        title: 'Guitar Lessons',
        description: 'Acoustic and electric guitar lessons for beginners. Learn chords, strumming patterns, and popular songs.',
        category: 'Music',
        level: 'Beginner',
        provider: { firstName: 'Jane', lastName: 'Smith' }
      },
      {
        id: '3',
        title: 'Digital Photography',
        description: 'Master the art of digital photography including composition, lighting, and post-processing techniques.',
        category: 'Arts',
        level: 'Intermediate',
        provider: { firstName: 'Mike', lastName: 'Johnson' }
      }
    ];

    return React.createElement('div', { className: 'min-h-screen bg-gray-50 py-8' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'text-center' },
          React.createElement('h1', { className: 'text-3xl font-extrabold text-gray-900 sm:text-4xl' },
            'Browse Skills'
          ),
          React.createElement('p', { className: 'mt-4 text-lg text-gray-600' },
            'Discover skills shared by our community of learners and teachers'
          )
        ),
        
        React.createElement('div', { className: 'mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3' },
          skills.map((skill) => 
            React.createElement('div', { 
              key: skill.id,
              className: 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer' 
            },
              React.createElement('div', { className: 'p-6' },
                React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-2' }, skill.title),
                React.createElement('p', { className: 'text-gray-600 mb-4' }, skill.description),
                React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                  React.createElement('span', { className: 'px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full' },
                    skill.category
                  ),
                  React.createElement('span', { className: 'px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full' },
                    skill.level
                  )
                ),
                React.createElement('div', { className: 'flex items-center' },
                  React.createElement('div', { className: 'w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium' },
                    skill.provider.firstName[0]
                  ),
                  React.createElement('span', { className: 'ml-2 text-sm text-gray-700' },
                    `${skill.provider.firstName} ${skill.provider.lastName}`
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
    React.createElement('div', { className: 'min-h-screen bg-gray-50 py-8' },
      React.createElement('div', { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 mb-8' }, 'Profile'),
        React.createElement('div', { className: 'bg-white rounded-lg shadow-md p-6' },
          React.createElement('div', { className: 'flex items-center mb-6' },
            React.createElement('div', { className: 'w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold' },
              `${user?.firstName[0]}${user?.lastName[0]}`
            ),
            React.createElement('div', { className: 'ml-4' },
              React.createElement('h2', { className: 'text-xl font-bold text-gray-900' },
                `${user?.firstName} ${user?.lastName}`
              ),
              React.createElement('p', { className: 'text-gray-600' }, `@${user?.username}`),
              React.createElement('p', { className: 'text-gray-600' }, user?.email)
            )
          ),
          React.createElement('div', { className: 'border-t pt-6' },
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 mb-4' }, 'Account Information'),
            React.createElement('div', { className: 'grid gap-4 md:grid-cols-2' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'First Name'),
                React.createElement('input', {
                  type: 'text',
                  value: user?.firstName || '',
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50',
                  readOnly: true
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Last Name'),
                React.createElement('input', {
                  type: 'text',
                  value: user?.lastName || '',
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50',
                  readOnly: true
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Email'),
                React.createElement('input', {
                  type: 'email',
                  value: user?.email || '',
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50',
                  readOnly: true
                })
              )
            )
          )
        )
      )
    )
  );

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
      case 'profile':
        return user ? React.createElement(ProfilePage) : React.createElement(LoginPage);
      default:
        return React.createElement(HomePage);
    }
  };

  return React.createElement('div', { className: 'App' },
    React.createElement(Navbar),
    renderCurrentPage()
  );
};

// Load Tailwind CSS
const link = document.createElement('link');
link.href = 'https://cdn.tailwindcss.com';
link.rel = 'stylesheet';
document.head.appendChild(link);

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