import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './components/Navbar';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Donations from './Pages/Donations';

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
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;