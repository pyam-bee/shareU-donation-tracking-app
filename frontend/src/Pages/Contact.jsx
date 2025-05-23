import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    alert('Thank you for your message. We will get back to you soon!');
  };

  // Office locations
  const officeLocations = [
    {
      city: "ShareU-Kathmandu",
      address: "Naxal, Ktm",
      phone: "01-53242333",
      email: "shareuKTM@greatcarecharity.org"
    },
    {
      city: "ShareU-Pokhara",
      address: "Malepatan, Phk",
      phone: "+977 9755556782",
      email: "shareuPHK@greatcarecharity.org"
    }
  ];

  return (
    <div className="bg-charity-warm min-h-screen">
      {/* Header Banner */}
      <section className="bg-charity-warm text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Contact Us</h1>
          <p className="text-white text-center mb-0">We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Send us a message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-full px-6 py-3 flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
                >
                  <span>Send Message</span>
                  <span className="bg-blue-500 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-blue-800">Our Offices</h2>
              <div className="grid grid-cols-1 gap-6">
                {officeLocations.map((office, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition duration-300">
                    <h3 className="text-lg font-bold mb-2">{office.city}</h3>
                    <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm">{office.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{office.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">Interactive map would be displayed here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
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

export default Contact;