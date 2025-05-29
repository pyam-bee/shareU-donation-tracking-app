import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoimg from '../assets/logo/shareu.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    setIsLoggedIn(!!token);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Set email from user data or from localStorage directly
        setUserEmail(parsedUser.email || localStorage.getItem('userEmail') || '');
        // Set profile picture if available
        setProfilePicture(parsedUser.profilePicture || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Try to get email directly if parsing failed
        setUserEmail(localStorage.getItem('userEmail') || '');
      }
    } else if (token) {
      // If there's a token but no user data, try to get email directly
      setUserEmail(localStorage.getItem('userEmail') || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUser(null);
    setUserEmail('');
    setProfilePicture('');
    setUserDropdownOpen(false);
    navigate('/');
  };

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (user && user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
      }
      return user.name.charAt(0).toUpperCase();
    }
    
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Function to get user's display name or email
  const getUserDisplayName = () => {
    if (user && user.name) return user.name;
    if (userEmail) return userEmail;
    return 'User';
  };

  return (
    <nav className="bg-gradient-to-br from-gray-900 to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logoimg} alt="ShareU-Logo" className="h-16 w-50"/>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-white hover:bg-[#00A676]">
              Home
            </Link>
            <Link to="/donations" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-white hover:bg-[#00A676]">
              Donations
            </Link>
            <Link to="/campaigns" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-white hover:bg-[#00A676]">
              Campaigns
            </Link>
            <Link to="/transactions" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-white hover:bg-[#00A676]">
              Transactions
            </Link>
            
            {isLoggedIn ? (
              <>                
                {/* User profile dropdown */}
                <div className="ml-3 relative flex items-center">
                  {/* User avatar - profile picture or initials */}
                  <div 
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white font-medium border-2 border-white shadow-sm cursor-pointer overflow-hidden"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                        {getUserInitials()}
                      </div>
                    )}
                  </div>
                  
                  {/* Dropdown toggle button */}
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center ml-1 focus:outline-none"
                  >
                    <svg 
                      className="h-5 w-5 text-gray-400 hover:text-gray-500" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  {userDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10 top-10">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          {/* Profile picture in dropdown menu */}
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            {profilePicture ? (
                              <img 
                                src={profilePicture} 
                                alt="Profile" 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white">
                                {getUserInitials()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {userEmail || "No email available"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link to="/my-campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Campaigns
                      </Link>
                      <Link to="/create-campaign" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Create Campaign
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link> */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 border-blue-600">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            {isLoggedIn && (
              <div className="mr-2">
                {/* User avatar for mobile */}
                <div 
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white font-medium border-2 border-white shadow-sm cursor-pointer overflow-hidden"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                
                {userDropdownOpen && (
                  <div className="origin-top-right absolute right-16 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {/* Profile picture in mobile dropdown */}
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          {profilePicture ? (
                            <img 
                              src={profilePicture} 
                              alt="Profile" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white">
                              {getUserInitials()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {userEmail || "No email available"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link to="/my-campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Campaigns
                    </Link>
                    <Link to="/create-campaign" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Create Campaign
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className={`${menuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${menuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${menuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Home
          </Link>
          <Link to="/donations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Donations
          </Link>
          <Link to="/campaigns" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Campaigns
          </Link>
          <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Contact
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Dashboard
              </Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Profile
              </Link>
              <Link to="/my-campaigns" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                My Campaigns
              </Link>
              <Link to="/create-campaign" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Create Campaign
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Login
              </Link>
              <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;