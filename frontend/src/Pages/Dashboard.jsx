import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Sample data
  const [donations, setDonations] = useState([
    { id: 1, date: '2025-03-01', amount: 250, project: 'School Rebuilding', status: 'Completed' },
    { id: 2, date: '2025-02-15', amount: 100, project: 'Food Bank Drive', status: 'Completed' },
    { id: 3, date: '2025-01-22', amount: 75, project: 'Medical Supplies', status: 'Completed' },
    { id: 4, date: '2025-03-10', amount: 200, project: 'School Rebuilding', status: 'Processing' }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, name: 'Annual Fundraiser Gala', date: '2025-04-25', location: 'Grand Hotel, New York' },
    { id: 2, name: 'Community Food Drive', date: '2025-04-15', location: 'Central Park, New York' },
    { id: 3, name: 'Volunteer Training Session', date: '2025-04-10', location: 'Online - Zoom' }
  ]);

  const [volunteering, setVolunteering] = useState([
    { id: 1, activity: 'Food Distribution', hours: 12, date: '2025-03-05' },
    { id: 2, activity: 'Teaching Assistant', hours: 8, date: '2025-02-20' },
    { id: 3, activity: 'Fundraising Call Center', hours: 4, date: '2025-01-15' }
  ]);

  // Statistics
  const stats = {
    totalDonations: donations.reduce((sum, donation) => sum + donation.amount, 0),
    volunteerHours: volunteering.reduce((sum, activity) => sum + activity.hours, 0),
    projectsSupported: [...new Set(donations.map(donation => donation.project))].length,
    upcomingEvents: upcomingEvents.length
  };

  // Suggested projects
  const suggestedProjects = [
    {
      title: "School Rebuilding",
      subTitle: "Rural Education Initiative",
      description: "Help rebuild schools damaged by natural disasters in rural areas.",
      percentFunded: 75
    },
    {
      title: "Food Bank Drive",
      subTitle: "Community Nutrition Program",
      description: "Support our ongoing food distribution program for vulnerable families.",
      percentFunded: 60
    },
    {
      title: "Medical Supplies",
      subTitle: "Healthcare Access Project",
      description: "Provide essential medical supplies to remote clinics in underserved areas.",
      percentFunded: 45
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Dashboard Header */}
      <section className="bg-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your charity activity at a glance.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/donations" className="bg-blue-600 text-white rounded-full px-6 py-3 flex items-center space-x-2 hover:bg-blue-700 transition duration-300">
                <span>Make a Donation</span>
                <span className="bg-blue-500 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Donations</p>
                  <p className="text-2xl font-bold">${stats.totalDonations}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Volunteer Hours</p>
                  <p className="text-2xl font-bold">{stats.volunteerHours}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Projects Supported</p>
                  <p className="text-2xl font-bold">{stats.projectsSupported}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Events</p>
                  <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Donation History */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Donation History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Amount</th>
                        <th className="px-4 py-2 text-left">Project</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation) => (
                        <tr key={donation.id} className="border-b">
                          <td className="px-4 py-3">{donation.date}</td>
                          <td className="px-4 py-3">${donation.amount}</td>
                          <td className="px-4 py-3">{donation.project}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${donation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {donation.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <Link to="/donations/history" className="text-blue-600 hover:underline text-sm">View all donations</Link>
                </div>
              </div>

              {/* Volunteering */}
              <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Your Volunteer Activities</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Activity</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteering.map((activity) => (
                        <tr key={activity.id} className="border-b">
                          <td className="px-4 py-3">{activity.activity}</td>
                          <td className="px-4 py-3">{activity.date}</td>
                          <td className="px-4 py-3">{activity.hours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <Link to="/volunteer/history" className="text-blue-600 hover:underline text-sm">View all activities</Link>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Upcoming Events</h2>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="mb-4 border-b pb-4">
                    <h3 className="font-bold text-md">{event.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-center">
                  <Link to="/events" className="bg-blue-600 text-white rounded-full px-4 py-2 text-sm hover:bg-blue-700 transition duration-300">View all events</Link>
                </div>
              </div>

              {/* Suggested Projects */}
              <div className="bg-white rounded-lg shadow p-6 mt-8">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Suggested Projects</h2>
                {suggestedProjects.map((project, index) => (
                  <div key={index} className="mb-4 border-b pb-4">
                    <h3 className="font-bold text-md">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.subTitle}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.percentFunded}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>{project.percentFunded}% funded</span>
                      <span>Target: $10,000</span>
                    </div>
                    <Link to={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-600 hover:underline text-sm">Learn more</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/donations" className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Donate</h3>
              <p className="text-sm text-gray-600 text-center">Support our projects with a financial contribution</p>
            </Link>
            
            <Link to="/volunteer" className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Volunteer</h3>
              <p className="text-sm text-gray-600 text-center">Sign up for volunteer opportunities near you</p>
            </Link>
            
            <Link to="/fundraise" className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Fundraise</h3>
              <p className="text-sm text-gray-600 text-center">Create your own fundraising campaign</p>
            </Link>
            
            <Link to="/share" className="bg-white rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition duration-300">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Share</h3>
              <p className="text-sm text-gray-600 text-center">Spread the word about our mission and impact</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:underline">Our Mission</Link></li>
                <li><Link to="/about/team" className="hover:underline">Our Team</Link></li>
                <li><Link to="/about/impact" className="hover:underline">Impact Report</Link></li>
                <li><Link to="/about/partners" className="hover:underline">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Get Involved</h3>
              <ul className="space-y-2">
                <li><Link to="/donate" className="hover:underline">Donate</Link></li>
                <li><Link to="/volunteer" className="hover:underline">Volunteer</Link></li>
                <li><Link to="/fundraise" className="hover:underline">Fundraise</Link></li>
                <li><Link to="/corporate" className="hover:underline">Corporate Partnerships</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="hover:underline">Blog</Link></li>
                <li><Link to="/resources/faq" className="hover:underline">FAQ</Link></li>
                <li><Link to="/resources/press" className="hover:underline">Press</Link></li>
                <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="bg-white text-blue-800 rounded-full p-2 hover:bg-blue-100 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 5.91a8.76 8.76 0 01-2.36.66 4.06 4.06 0 001.77-2.27 7.8 7.8 0 01-2.15.85 4.13 4.13 0 00-7.1 3.77A11.6 11.6 0 013 4.9a4.2 4.2 0 001.24 5.5 3.87 3.87 0 01-1.82-.51v.05a4.15 4.15 0 003.29 4.07 4 4 0 01-1.86.07 4.14 4.14 0 003.83 2.87A8.25 8.25 0 012 18.56a11.48 11.48 0 006.29 1.84c7.55 0 11.67-6.25 11.67-11.67L20 8a7.81 7.81 0 002-2.09z" />
                  </svg>
                </a>
                <a href="#" className="bg-white text-blue-800 rounded-full p-2 hover:bg-blue-100 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04a10.03 10.03 0 00-7.07 2.92A9.97 9.97 0 002 12.04c0 5.52 4.47 10 10 10s10-4.48 10-10c0-2.65-1.04-5.2-2.93-7.08A10.03 10.03 0 0012 2.04zm3.6 15.92c-.3.01-.6.04-1.02.04-1.69 0-2-.8-2-1.44v-2.62h3v-2.5h-3V8h-2.5v3.4H8v2.5h2.08v2.95c0 2.06 1.22 3.15 3.55 3.15.99 0 2.05-.16 2.74-.42l-.77-2.62z" />
                  </svg>
                </a>
                <a href="#" className="bg-white text-blue-800 rounded-full p-2 hover:bg-blue-100 transition duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c2.717 0 3.057.01 4.123.06 1.064.05 1.79.217 2.428.465a4.9 4.9 0 011.772 1.153 4.9 4.9 0 011.153 1.773c.247.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.057-.06 4.123-.05 1.064-.218 1.79-.465 2.428a4.9 4.9 0 01-1.153 1.772 4.9 4.9 0 01-1.772 1.153c-.637.247-1.364.415-2.428.465-1.066.05-1.406.06-4.123.06-2.717 0-3.057-.01-4.123-.06-1.064-.05-1.79-.218-2.428-.465a4.9 4.9 0 01-1.772-1.153 4.9 4.9 0 01-1.153-1.772c-.247-.637-.415-1.364-.465-2.428C2.01 15.057 2 14.717 2 12c0-2.717.01-3.057.06-4.123.05-1.064.218-1.79.465-2.428a4.9 4.9 0 011.153-1.772A4.9 4.9 0 015.45.524C6.087.277 6.814.11 7.877.06 8.943.01 9.283 0 12 0zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.25-9.25a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
                  </svg>
                </a>
                <a href="#" className="bg-white text-blue-800 rounded-full p-2 hover:bg-blue-100 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2c2.717 0 3.057.01 4.123.06 1.064.05 1.79.217 2.428.465a4.9 4.9 0 011.772 1.153 4.9 4.9 0 011.153 1.773c.247.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.057-.06 4.123-.05 1.064-.218 1.79-.465 2.428a4.9 4.9 0 01-1.153 1.772 4.9 4.9 0 01-1.772 1.153c-.637.247-1.364.415-2.428.465-1.066.05-1.406.06-4.123.06-2.717 0-3.057-.01-4.123-.06-1.064-.05-1.79-.218-2.428-.465a4.9 4.9 0 01-1.772-1.153 4.9 4.9 0 01-1.153-1.772c-.247-.637-.415-1.364-.465-2.428C2.01 15.057 2 14.717 2 12c0-2.717.01-3.057.06-4.123.05-1.064.218-1.79.465-2.428a4.9 4.9 0 011.153-1.772A4.9 4.9 0 015.45.524C6.087.277 6.814.11 7.877.06 8.943.01 9.283 0 12 0zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.25-9.25a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
                    </svg>
                </a>
            </div>
            <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Subscribe to Our Newsletter</h3>
            <div className="flex">
                <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded-l-lg focus:outline-none" />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition duration-300">
                Subscribe
                </button>
            </div>
            </div>
        </div>
        <div className="mt-8 pt-6 border-t border-blue-700 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Charity Organization. All rights reserved.</p>
            <div className="mt-2">
            <Link to="/privacy" className="hover:underline mx-2">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline mx-2">Terms of Service</Link>
            <Link to="/accessibility" className="hover:underline mx-2">Accessibility</Link>
            </div>
        </div>
        </div>
    </div>
    </footer>
    </div>
  );
};

export default Dashboard;