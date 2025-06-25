import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userType, setUserType] = useState('');
  const [authMode, setAuthMode] = useState('signin');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${backendUrl}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
    }
  };

  const handleAuth = async (email, password, name = '') => {
    try {
      const endpoint = authMode === 'signin' ? '/api/signin' : '/api/signup';
      const body = authMode === 'signin' 
        ? { email, password }
        : { email, password, name, user_type: userType };

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        setCurrentUser(data.user);
        setShowSignIn(false);
        setShowSignUp(false);
      } else {
        alert(data.detail || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const openAuth = (type, mode) => {
    setUserType(type);
    setAuthMode(mode);
    if (mode === 'signin') {
      setShowSignIn(true);
    } else {
      setShowSignUp(true);
    }
  };

  if (currentUser) {
    return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">Home</a>
              <a href="#hiring" className="text-gray-700 hover:text-blue-600 transition-colors">Hiring</a>
              <a href="#applying" className="text-gray-700 hover:text-blue-600 transition-colors">Applying</a>
              <a href="#freelancing" className="text-gray-700 hover:text-blue-600 transition-colors">Freelancing</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Connect Talent with Opportunity</h1>
              <p className="text-xl mb-8 text-blue-100">
                The ultimate job portal connecting hirers, job seekers, and freelancers in one powerful platform.
                Find your perfect match today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => openAuth('applicant', 'signup')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Find Jobs
                </button>
                <button 
                  onClick={() => openAuth('hirer', 'signup')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Post Jobs
                </button>
              </div>
            </div>
            <div className="lg:text-right">
              <img 
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" 
                alt="Professional team collaboration"
                className="rounded-lg shadow-2xl w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Section */}
      <section id="hiring" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg" 
                alt="Professional hiring process"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Hirers</h2>
              <p className="text-lg text-gray-600 mb-8">
                Streamline your recruitment process with our advanced hiring tools and access to top talent.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Candidate Matching</h3>
                    <p className="text-gray-600">AI-powered matching to find the perfect candidates for your roles</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Application Management</h3>
                    <p className="text-gray-600">Organize and track all applications in one centralized dashboard</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
                    <p className="text-gray-600">Detailed insights and reports on your hiring performance</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => openAuth('hirer', 'signup')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start Hiring
                </button>
                <button 
                  onClick={() => openAuth('hirer', 'signin')}
                  className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Applying Section */}
      <section id="applying" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Job Seekers</h2>
              <p className="text-lg text-gray-600 mb-8">
                Discover your dream job with our comprehensive job search and application platform.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Job Recommendations</h3>
                    <p className="text-gray-600">Get job suggestions tailored to your skills and preferences</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">One-Click Applications</h3>
                    <p className="text-gray-600">Apply to multiple jobs quickly with your saved profile</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Application Tracking</h3>
                    <p className="text-gray-600">Track the status of all your job applications in real-time</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => openAuth('applicant', 'signup')}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Find Jobs
                </button>
                <button 
                  onClick={() => openAuth('applicant', 'signin')}
                  className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/4226115/pexels-photo-4226115.jpeg" 
                alt="Job application process"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Freelancing Section */}
      <section id="freelancing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg" 
                alt="Freelancer working remotely"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">For Freelancers</h2>
              <p className="text-lg text-gray-600 mb-8">
                Build your freelance career with access to quality projects and clients worldwide.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Project Marketplace</h3>
                    <p className="text-gray-600">Browse and bid on projects that match your expertise</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                    <p className="text-gray-600">Get paid safely and on time with our escrow system</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Portfolio Showcase</h3>
                    <p className="text-gray-600">Display your work and build your professional reputation</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => openAuth('freelancer', 'signup')}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Start Freelancing
                </button>
                <button 
                  onClick={() => openAuth('freelancer', 'signin')}
                  className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">JobPortal</h3>
            <p className="text-gray-400 mb-8">Connecting talent with opportunity worldwide</p>
            <div className="flex justify-center space-x-8">
              <a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#hiring" className="text-gray-400 hover:text-white transition-colors">Hiring</a>
              <a href="#applying" className="text-gray-400 hover:text-white transition-colors">Applying</a>
              <a href="#freelancing" className="text-gray-400 hover:text-white transition-colors">Freelancing</a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400">&copy; 2025 JobPortal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {showSignIn && (
        <AuthModal
          title={`Sign In as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
          isSignUp={false}
          onClose={() => setShowSignIn(false)}
          onSubmit={handleAuth}
        />
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <AuthModal
          title={`Sign Up as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
          isSignUp={true}
          onClose={() => setShowSignUp(false)}
          onSubmit={handleAuth}
        />
      )}
    </div>
  );
}

// Auth Modal Component
function AuthModal({ title, isSignUp, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password, name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// User Dashboard Component
function UserDashboard({ user, onLogout }) {
  const getDashboardContent = () => {
    switch (user.user_type) {
      case 'hirer':
        return (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Hirer Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Post a Job</h4>
                <p className="text-gray-600 mb-4">Create and publish job listings to attract top talent</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Post Job
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Manage Applications</h4>
                <p className="text-gray-600 mb-4">Review and manage candidate applications</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View Applications
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                <p className="text-gray-600 mb-4">Track your hiring performance and metrics</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        );
      case 'applicant':
        return (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-green-900 mb-4">Job Seeker Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Browse Jobs</h4>
                <p className="text-gray-600 mb-4">Discover new job opportunities tailored for you</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Browse Jobs
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">My Applications</h4>
                <p className="text-gray-600 mb-4">Track the status of your job applications</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  View Applications
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Profile</h4>
                <p className="text-gray-600 mb-4">Update your resume and professional profile</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        );
      case 'freelancer':
        return (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">Freelancer Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Find Projects</h4>
                <p className="text-gray-600 mb-4">Browse and bid on freelance projects</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Find Projects
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">My Proposals</h4>
                <p className="text-gray-600 mb-4">Track your project proposals and bids</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  View Proposals
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Portfolio</h4>
                <p className="text-gray-600 mb-4">Showcase your work and build your reputation</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Manage Portfolio
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Dashboard content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDashboardContent()}
      </div>
    </div>
  );
}

export default App;