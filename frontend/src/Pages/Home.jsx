import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Placeholder data for the three-column section
  const featureCards = [
    {
      title: "Support Education",
      description: "Help provide educational resources and scholarships to children in underserved communities"
    },
    {
      title: "Feed the Hungry",
      description: "Your donation helps provide nutritious meals to families experiencing food insecurity"
    },
    {
      title: "Build Communities",
      description: "Support infrastructure projects that bring clean water, shelter, and safety to those in need"
    }
  ];

  // Placeholder data for the three-column project section
  const projectCards = [
    {
      title: "School Rebuilding",
      subTitle: "Rural Education Initiative",
      description: "Helping rebuild schools damaged by natural disasters..."
    },
    {
      title: "Food Bank Drive",
      subTitle: "Community Nutrition Program",
      description: "Distributing food packages to vulnerable families..."
    },
    {
      title: "Medical Supplies",
      subTitle: "Healthcare Access Project",
      description: "Providing essential medical supplies to remote clinics..."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Great futures are built with a small charity
              </h1>
              <p className="text-gray-600 mb-8">
                Your donation today can change someone's tomorrow. Join us in making a difference.
              </p>
              <div className="flex">
                <Link to="/donations" className="bg-blue-600 text-white rounded-full px-6 py-3 flex items-center space-x-2 hover:bg-blue-700 transition duration-300">
                  <span>Donate Now</span>
                  <span className="bg-blue-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg h-36 w-36 overflow-hidden">
                  <img 
                    src="https://picsum.photos/400/320?random=1" 
                    alt="Children receiving educational resources" 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg h-48 w-36 overflow-hidden">
                  <img 
                    src="https://picsum.photos/400/320?random=2" 
                    alt="Volunteers distributing food packages" 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-lg h-48 w-36 overflow-hidden flex items-end justify-end relative">
                  <img 
                    src="https://picsum.photos/400/320?random=3" 
                    alt="Medical supplies being delivered" 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="bg-blue-600 text-white rounded-full p-1 absolute bottom-3 right-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
                <div className="rounded-lg h-36 w-36 overflow-hidden">
                  <img 
                    src="https://picsum.photos/400/320?random=4" 
                    alt="Community building project" 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50 rounded-lg mx-4 my-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12 text-blue-800">How Your Donation Helps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full h-24 w-24 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-blue-800">Current Projects</h2>
          <div className="flex items-center mb-4">
          <button className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2 hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="ml-auto h-1 bg-blue-200 rounded-full w-32">
              <div className="h-1 bg-blue-600 rounded-full w-12"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectCards.map((card, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition duration-300">
                <div className="rounded-lg h-32 w-full mb-4 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/400/320?random=${index + 5}`} 
                    alt={card.title} 
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-bold">{card.title}</h3>
                <h4 className="text-sm text-gray-700 mb-2">{card.subTitle}</h4>
                <p className="text-xs text-gray-500 mb-4">{card.description}</p>
                <div className="rounded-full bg-blue-600 p-2 w-10 h-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img 
                src="https://picsum.photos/200/200?random=8" 
                alt="Volunteer" 
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="col-span-2 text-center">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">Join Our Community</h2>
              <button className="bg-blue-600 text-white text-sm px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                Yes I want to be a volunteer
              </button>
            </div>
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img 
                src="https://picsum.photos/200/200?random=9" 
                alt="Volunteer helping" 
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 py-4 mt-12">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Left: Logo/Site Name */}
      <div className="mb-4 md:mb-0">
        <span className="font-semibold">Great Care Charity</span>
        <div className="text-xs text-gray-500 mt-1">©2025 Copyright</div>
      </div>
      
      {/* Center: Navigation */}
      <div className="flex space-x-6 mb-4 md:mb-0">
        <a href="#" className="hover:text-blue-600 transition duration-300">Our work</a>
        <a href="#" className="hover:text-blue-600 transition duration-300">Donate</a>
        <a href="#" className="hover:text-blue-600 transition duration-300">Events</a>
        <a href="#" className="hover:text-blue-600 transition duration-300">Program</a>
        <a href="#" className="hover:text-blue-600 transition duration-300">Twitter</a>
        <a href="#" className="hover:text-blue-600 transition duration-300">LinkedIn</a>
      </div>
      
      {/* Right: Donate button */}
      <div>
        <Link to="/donations" className="bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center space-x-1 hover:bg-gray-50 transition duration-300">
          <span className="text-sm">Donate now</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;