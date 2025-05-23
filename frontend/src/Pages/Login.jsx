import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        initializeGoogleSignIn();
      };
    };
    
    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '774871976972-hjmokve6ao787onptt7gdf2b5ch8kgs8.apps.googleusercontent.com',
        callback: handleGoogleSignIn
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  };

  const handleGoogleSignIn = async (response) => {
    setLoading(true);
    setError('');
    try {
      // Decode the JWT token to extract user info including profile picture
      const jwtToken = response.credential;
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      
      // Extract profile picture URL from token payload
      const profilePicture = payload.picture || '';
      
      // Send the ID token to your backend
      const googleResponse = await axios.post('http://localhost:4000/api/auth/google-signin', {
        token: response.credential
      });
      
      // Store token and user info
      localStorage.setItem('token', googleResponse.data.token);
      localStorage.setItem('userEmail', googleResponse.data.user.email);
      
      // Create enhanced user object with profile picture
      const enhancedUser = {
        ...googleResponse.data.user,
        profilePicture: profilePicture // Add profile picture to user object
      };
      
      // Store enhanced user info
      localStorage.setItem('user', JSON.stringify(enhancedUser));
      
      // Show success message
      setSuccess('User logged in successfully!');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate('/');
        // Refresh the page to update navbar state
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Google login failed', error);
      setError(error.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAccess = (userEmail) => {
    // This could be a list of admin emails or you could check a role field from your API response
    const adminEmails = ['admin@example.com', 'youradmin@email.com'];
    return adminEmails.includes(userEmail);
  };
  
  // Then modify your handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', formData);
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', formData.email);
      
      // Check if user is admin from backend response
      const isAdmin = response.data.user.isAdmin || false;
      
      // Store user info with admin flag
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Show success message
      setSuccess('User logged in successfully!');
      
      // Redirect based on role after a short delay
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
        
        // Refresh the page to update navbar state
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Login failed', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
            <p>{success}</p>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <div id="googleSignInButton" className="w-full flex justify-center"></div>
            </div>
          </div>
        </form>
        
        {/* Admin Access Link */}
        <div className="text-center mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Admin Access</span>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/login"
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;