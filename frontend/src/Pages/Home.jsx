import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-white">
              Great futures are built with a small charity
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Your donation today can change someone's tomorrow. Join us in making a difference.
            </p>
            <Link
              to="/donations"
              className="inline-block bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:from-purple-700 hover:via-pink-600 hover:to-red-600 transition duration-300"
            >
              Donate Now
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={`https://picsum.photos/400/320?random=${i}`}
                  alt={`Image ${i}`}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800 rounded-3xl mx-4 my-12 shadow-xl">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-12">How Your Donation Helps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="mb-4 text-pink-400">
                  {/* Icons already conditionally rendered */}
                  {index === 0 && (
                    <svg className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 6.253v13M12 6.253C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="h-10 w-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-white">Current Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectCards.map((card, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-2xl transition duration-300">
                <img
                  src={`https://picsum.photos/400/320?random=${index + 5}`}
                  alt={card.title}
                  className="rounded-lg h-40 w-full object-cover mb-4"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-1 text-white">{card.title}</h3>
                <h4 className="text-sm text-pink-400 mb-2">{card.subTitle}</h4>
                <p className="text-sm text-gray-400 mb-4">{card.description}</p>
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full text-white hover:scale-105 transition duration-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gray-900 text-center">
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <p className="mb-8 text-gray-400">Be part of something bigger than yourself. Make a difference.</p>
        <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition duration-300">
          Yes, I want to be a volunteer
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="text-lg font-semibold text-white">Great Care Charity</div>
            <div className="text-xs">©2025 All rights reserved</div>
          </div>
          <div className="flex flex-wrap justify-center space-x-4 text-sm mb-4 md:mb-0">
            <a href="#" className="hover:text-pink-500 transition">Our work</a>
            <a href="#" className="hover:text-pink-500 transition">Donate</a>
            <a href="#" className="hover:text-pink-500 transition">Events</a>
            <a href="#" className="hover:text-pink-500 transition">Program</a>
            <a href="#" className="hover:text-pink-500 transition">Twitter</a>
            <a href="#" className="hover:text-pink-500 transition">LinkedIn</a>
          </div>
          <Link
            to="/donations"
            className="bg-white text-gray-800 text-sm px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Donate now
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
