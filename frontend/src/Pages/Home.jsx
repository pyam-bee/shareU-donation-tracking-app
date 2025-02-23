import React, { useState } from 'react';
import DonationCard from '../Components/DonationCard';

const Home = () => {
  const [donations] = useState([
    {
        title: "Help Local Food Bank",
        description: "Support our community food bank in providing meals to families in need.",
        currentAmount: 1.5,
        targetAmount: 5,
        category: "Community",
        creator: "0x1234...5678",
        donors: 12
    },
    {
        title: "Help the Victims",
        description: "Support our community food bank in providing meals to families in need.",
        currentAmount: 3.5,
        targetAmount: 5,
        category: "Social Worker",
        creator: "Suporters",
        donors: 35
    },
    {
        title: "Support for Recovery",
        description: "Join us in providing essential aid and resources to those in need. Every contribution makes a difference!",
        currentAmount: 7.5,
        targetAmount: 20,
        category: "Donator",
        creator: "Humad",
        donors: 50
    },
    {
        title: "Rebuilding Lives Together",
        description: "Help rebuild communities by contributing to this cause. Your support matters more than ever.",
        currentAmount: 20,
        targetAmount: 40,
        category: "Relief Fund",
        creator: "HopeInitiative",
        donors: 42
    },
    {
        title: "Aid for a Brighter Future",
        description: "Your generosity can light the way for families in crisis. Join us in making an impact.",
        currentAmount: 7.5,
        targetAmount: 100,
        category: "Humanitarian",
        creator: "FutureAid",
        donors: 60
    },
{
        title: "Together for Change",
        description: "Let’s unite to bring hope and help to those facing hardships. Every dollar counts.",
        currentAmount: 450,
        targetAmount: 400,
        category: "Community Support",
        creator: "CareAlliance",
        donors: 214
    },
    {
        title: "Hands of Hope",
        description: "Extend a helping hand to those in urgent need. Your contribution brings immediate relief.",
        currentAmount: 10.75,
        targetAmount: 200,
        category: "Emergency Assistance",
        creator: "ReliefPartners",
        donors: 48
    },
    {
        title: "Lend a Helping Hand",
        description: "Be a part of changing lives by supporting this critical mission. Your help goes a long way.",
        currentAmount: 1500.66,
        targetAmount: 2000,
        category: "Support Fund",
        creator: "UnityRelief",
        donors: 535
    }
                
  ]);

  const handleDonate = async (donationId, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/donations/${donationId}/donate`, 
        { amount }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state or refetch donations
    } catch (error) {
      console.error('Donation failed', error.response.data);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation, index) => (
          <DonationCard 
            key={index}
            donation={donation}
            onDonate={handleDonate}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;