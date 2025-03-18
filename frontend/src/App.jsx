import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Donations from './Pages/Donations';
import CampaignApplication from './Pages/CampaignApplication';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/donations" element={<Donations />} />
          <Route path='/campaigns' element={<CampaignApplication />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;