import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DonationCard from '../Components/DonationCard';

const Home = () => {
  const [donations, setDonations] = useState([
    {
        id: 1,
        title: "Help Local Food Bank",
        description: "Support our community food bank in providing meals to families in need.",
        currentAmount: 1.5,
        targetAmount: 5,
        category: "Community",
        creator: "0x1234...5678",
        donors: 12,
        imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=2070"
    },
    {
        id: 2,
        title: "Help the Victims",
        description: "Support our community food bank in providing meals to families in need.",
        currentAmount: 3.5,
        targetAmount: 5,
        category: "Social Worker",
        creator: "Suporters",
        donors: 35,
        imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2070"
    },
    {
        id: 3,
        title: "Support for Recovery",
        description: "Join us in providing essential aid and resources to those in need. Every contribution makes a difference!",
        currentAmount: 7.5,
        targetAmount: 20,
        category: "Donator",
        creator: "Humad",
        donors: 50,
        imageUrl: "https://images.unsplash.com/photo-1638352096026-2db043f87d7a?auto=format&fit=crop&q=80&w=2952"
    },
    {
        id: 4,
        title: "Rebuilding Lives Together",
        description: "Help rebuild communities by contributing to this cause. Your support matters more than ever.",
        currentAmount: 20,
        targetAmount: 40,
        category: "Relief Fund",
        creator: "HopeInitiative",
        donors: 42,
        imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2070"
    },
    {
        id: 5,
        title: "Aid for a Brighter Future",
        description: "Your generosity can light the way for families in crisis. Join us in making an impact.",
        currentAmount: 7.5,
        targetAmount: 100,
        category: "Humanitarian",
        creator: "FutureAid",
        donors: 60,
        imageUrl: "https://images.unsplash.com/photo-1637909947197-a77fcd7d7b7a?auto=format&fit=crop&q=80&w=2070"
    },
    {
        id: 6,
        title: "Together for Change",
        description: "Let's unite to bring hope and help to those facing hardships. Every dollar counts.",
        currentAmount: 450,
        targetAmount: 400,
        category: "Community Support",
        creator: "CareAlliance",
        donors: 214,
        imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=2070"
    },
    {
        id: 7,
        title: "Hands of Hope",
        description: "Extend a helping hand to those in urgent need. Your contribution brings immediate relief.",
        currentAmount: 10.75,
        targetAmount: 200,
        category: "Emergency Assistance",
        creator: "ReliefPartners",
        donors: 48,
        imageUrl: "https://images.unsplash.com/photo-1638352096026-2db043f87d7a?auto=format&fit=crop&q=80&w=2952"
    },
    {
        id: 8,
        title: "Lend a Helping Hand",
        description: "Be a part of changing lives by supporting this critical mission. Your help goes a long way.",
        currentAmount: 1500.66,
        targetAmount: 2000,
        category: "Support Fund",
        creator: "UnityRelief",
        donors: 535,
        imageUrl: "https://images.unsplash.com/photo-1637909947197-a77fcd7d7b7a?auto=format&fit=crop&q=80&w=2070"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Optional: Fetch donations from API instead of using static data
  // useEffect(() => {
  //   const fetchDonations = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get('/api/donations');
  //       setDonations(response.data);
  //       setError(null);
  //     } catch (err) {
  //       setError('Failed to fetch donations. Please try again later.');
  //       console.error('Error fetching donations:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchDonations();
  // }, []);

  const handleDonate = async (donationId, amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to make a donation');
        // Redirect to login page
        // window.location.href = '/login';
        return;
      }

      setLoading(true);
      const response = await axios.post(`/api/donations/${donationId}/donate`, 
        { amount }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state with new donation amount
      setDonations(prevDonations => 
        prevDonations.map(donation => 
          donation.id === donationId 
            ? { 
                ...donation, 
                currentAmount: donation.currentAmount + amount,
                donors: donation.donors + 1
              } 
            : donation
        )
      );
      
      alert('Thank you for your donation!');
    } catch (error) {
      console.error('Donation failed', error.response?.data || error.message);
      alert('Donation failed: ' + (error.response?.data?.message || 'Please try again later'));
    } finally {
      setLoading(false);
    }
  };

  // Filter donations based on search term and category
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchTerm === '' || 
      donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      donation.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(donations.map(donation => donation.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Support a Cause</h1>
        <p className="text-lg text-gray-600 mb-6">
          Browse through our donation campaigns and contribute to those in need.
        </p>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg 
              className="absolute right-3 top-3 h-6 w-6 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Donations grid */}
      {!loading && filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDonations.map((donation) => (
            <DonationCard 
              key={donation.id}
              donation={donation}
              onDonate={handleDonate}
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No donations found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Home;