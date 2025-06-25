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
    <div id="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <h1 className="brand-title">JobPortal</h1>
            </div>
            <div className="nav-links">
              <a href="#home" className="nav-link">Home</a>
              <a href="#hiring" className="nav-link">Hiring</a>
              <a href="#applying" className="nav-link">Applying</a>
              <a href="#freelancing" className="nav-link">Freelancing</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Connect Talent with Opportunity</h1>
              <p className="hero-description">
                The ultimate job portal connecting hirers, job seekers, and freelancers in one powerful platform.
                Find your perfect match today.
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={() => openAuth('applicant', 'signup')}
                  className="btn btn-primary"
                >
                  Find Jobs
                </button>
                <button 
                  onClick={() => openAuth('hirer', 'signup')}
                  className="btn btn-secondary"
                >
                  Post Jobs
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" 
                alt="Professional team collaboration"
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Section */}
      <section id="hiring" className="section section-white">
        <div className="container">
          <div className="section-content">
            <div className="section-image">
              <img 
                src="https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg" 
                alt="Professional hiring process"
                className="feature-img"
              />
            </div>
            <div className="section-text">
              <h2 className="section-title">For Hirers</h2>
              <p className="section-description">
                Streamline your recruitment process with our advanced hiring tools and access to top talent.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon feature-icon-blue">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Smart Candidate Matching</h3>
                    <p className="feature-desc">AI-powered matching to find the perfect candidates for your roles</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon feature-icon-blue">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Application Management</h3>
                    <p className="feature-desc">Organize and track all applications in one centralized dashboard</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon feature-icon-blue">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Advanced Analytics</h3>
                    <p className="feature-desc">Detailed insights and reports on your hiring performance</p>
                  </div>
                </div>
              </div>
              <div className="section-buttons">
                <button 
                  onClick={() => openAuth('hirer', 'signup')}
                  className="btn btn-blue"
                >
                  Start Hiring
                </button>
                <button 
                  onClick={() => openAuth('hirer', 'signin')}
                  className="btn btn-blue-outline"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Applying Section */}
      <section id="applying" className="section section-gray">
        <div className="container">
          <div className="section-content section-reverse">
            <div className="section-text">
              <h2 className="section-title">For Job Seekers</h2>
              <p className="section-description">
                Discover your dream job with our comprehensive job search and application platform.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon feature-icon-green">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Personalized Job Recommendations</h3>
                    <p className="feature-desc">Get job suggestions tailored to your skills and preferences</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon feature-icon-green">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">One-Click Applications</h3>
                    <p className="feature-desc">Apply to multiple jobs quickly with your saved profile</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon feature-icon-green">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Application Tracking</h3>
                    <p className="feature-desc">Track the status of all your job applications in real-time</p>
                  </div>
                </div>
              </div>
              <div className="section-buttons">
                <button 
                  onClick={() => openAuth('applicant', 'signup')}
                  className="btn btn-green"
                >
                  Find Jobs
                </button>
                <button 
                  onClick={() => openAuth('applicant', 'signin')}
                  className="btn btn-green-outline"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="section-image">
              <img 
                src="https://images.pexels.com/photos/4226115/pexels-photo-4226115.jpeg" 
                alt="Job application process"
                className="feature-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Freelancing Section */}
      <section id="freelancing" className="section section-white">
        <div className="container">
          <div className="section-content">
            <div className="section-image">
              <img 
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg" 
                alt="Freelancer working remotely"
                className="feature-img"
              />
            </div>
            <div className="section-text">
              <h2 className="section-title">For Freelancers</h2>
              <p className="section-description">
                Build your freelance career with access to quality projects and clients worldwide.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon feature-icon-purple">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Project Marketplace</h3>
                    <p className="feature-desc">Browse and bid on projects that match your expertise</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon feature-icon-purple">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Secure Payments</h3>
                    <p className="feature-desc">Get paid safely and on time with our escrow system</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon feature-icon-purple">
                    <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h3 className="feature-title">Portfolio Showcase</h3>
                    <p className="feature-desc">Display your work and build your professional reputation</p>
                  </div>
                </div>
              </div>
              <div className="section-buttons">
                <button 
                  onClick={() => openAuth('freelancer', 'signup')}
                  className="btn btn-purple"
                >
                  Start Freelancing
                </button>
                <button 
                  onClick={() => openAuth('freelancer', 'signin')}
                  className="btn btn-purple-outline"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <h3 className="footer-title">JobPortal</h3>
            <p className="footer-description">Connecting talent with opportunity worldwide</p>
            <div className="footer-links">
              <a href="#home" className="footer-link">Home</a>
              <a href="#hiring" className="footer-link">Hiring</a>
              <a href="#applying" className="footer-link">Applying</a>
              <a href="#freelancing" className="footer-link">Freelancing</a>
            </div>
            <div className="footer-bottom">
              <p className="footer-copyright">&copy; 2025 JobPortal. All rights reserved.</p>
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
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
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
          <div className="dashboard-section dashboard-hirer">
            <h3 className="dashboard-title">Hirer Dashboard</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h4 className="card-title">Post a Job</h4>
                <p className="card-description">Create and publish job listings to attract top talent</p>
                <button className="btn btn-blue">Post Job</button>
              </div>
              <div className="dashboard-card">
                <h4 className="card-title">Manage Applications</h4>
                <p className="card-description">Review and manage candidate applications</p>
                <button className="btn btn-blue">View Applications</button>
              </div>
              <div className="dashboard-card">
                <h4 className="card-title">Analytics</h4>
                <p className="card-description">Track your hiring performance and metrics</p>
                <button className="btn btn-blue">View Analytics</button>
              </div>
            </div>
          </div>
        );
      case 'applicant':
        return (
          <div className="dashboard-section dashboard-applicant">
            <h3 className="dashboard-title">Job Seeker Dashboard</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h4 className="card-title">Browse Jobs</h4>
                <p className="card-description">Discover new job opportunities tailored for you</p>
                <button className="btn btn-green">Browse Jobs</button>
              </div>
              <div className="dashboard-card">
                <h4 className="card-title">My Applications</h4>
                <p className="card-description">Track the status of your job applications</p>
                <button className="btn btn-green">View Applications</button>
              </div>
              <div className="dashboard-card">
                <h4 className="card-title">Profile</h4>
                <p className="card-description">Update your resume and professional profile</p>
                <button className="btn btn-green">Edit Profile</button>
              </div>
            </div>
          </div>
        );
      case 'freelancer':
        return (
          <div className="dashboard-section dashboard-freelancer">
            <h3 className="dashboard-title">Freelancer Dashboard</h3>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h4 className="card-title">Find Projects</h4>
                <p className="card-description">Browse and bid on freelance projects</p>
                <button className="btn btn-purple">Find Projects</button>
              </div>
              <div className="dashboard-card">
                <h4 className="card-title">My Proposals</h4>
                <p className="card-description">Track your project proposals and bids</p>
                <button className="btn btn-purple">View Proposals</button>
              </div>
              <div className="dashboard-card">
                <h4 className="card-title">Portfolio</h4>
                <p className="card-description">Showcase your work and build your reputation</p>
                <button className="btn btn-purple">Manage Portfolio</button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Dashboard content</div>;
    }
  };

  return (
    <div id="dashboard">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <h1 className="brand-title">JobPortal</h1>
            </div>
            <div className="nav-user">
              <span className="user-welcome">Welcome, {user.name}!</span>
              <button
                onClick={onLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="container">
          {getDashboardContent()}
        </div>
      </div>
    </div>
  );
}

export default App;