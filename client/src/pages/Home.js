import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import '../components/Hero';

const Home = () => {
    const featuredSkills = [
        {
            title: 'Web Development',
            description: 'Learn modern web technologies like React, Node.js, and more',
            icon: '💻',
            category: 'Technology'
        },
        {
            title: 'Digital Marketing',
            description: 'Master social media marketing, SEO, and content creation',
            icon: '📈',
            category: 'Marketing'
        },
        {
            title: 'Graphic Design',
            description: 'Create stunning visuals with Photoshop, Illustrator, and Figma',
            icon: '🎨',
            category: 'Design'
        },
        {
            title: 'Language Learning',
            description: 'Practice Spanish, French, German, and other languages',
            icon: '🌍',
            category: 'Languages'
        },
        {
            title: 'Music Production',
            description: 'Learn to create beats, mix tracks, and produce music',
            icon: '🎵',
            category: 'Music'
        },
        {
            title: 'Photography',
            description: 'Master composition, lighting, and photo editing techniques',
            icon: '📸',
            category: 'Photography'
        }
    ];

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

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <Hero />

            {/* Featured Skills Section */}
            <div className="bg-red-500 text-white p-4">
                <h1>hello</h1>
            </div>
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Popular Skills to Learn & Teach
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover the most in-demand skills on our platform and connect with passionate learners and teachers.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredSkills.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-4xl mb-4">{skill.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{skill.title}</h3>
                                <p className="text-gray-600 mb-4">{skill.description}</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {skill.category}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How SkillBridge Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Start your learning journey in three simple steps
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                step: '1',
                                title: 'Create Your Profile',
                                description: 'Sign up and list the skills you want to teach and learn. Build your profile to showcase your expertise.',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )
                            },
                            {
                                step: '2',
                                title: 'Find Perfect Matches',
                                description: 'Browse skills or get matched with users who complement your learning goals and teaching abilities.',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )
                            },
                            {
                                step: '3',
                                title: 'Start Learning & Teaching',
                                description: 'Connect with your matches, schedule sessions, and start exchanging knowledge in a supportive environment.',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                )
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                                        {item.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Community Says
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of learners and teachers who are transforming their skills
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                                <div className="flex text-yellow-400 mt-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Join our community of passionate learners and teachers. Share your skills, learn something new, and grow together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="/register"
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Get Started for Free
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="/skills"
                                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
                            >
                                Explore Skills
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
