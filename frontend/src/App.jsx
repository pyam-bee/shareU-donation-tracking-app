import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Donations from './Pages/Donations';
import CampaignApplication from './Pages/CampaignApplication';
import Contact from './Pages/Contact';
import Dashboard from './Pages/Dashboard';
import AdminPage from './Pages/AdminPage';

// Create a layout component that conditionally renders the Navbar
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/donations" element={<Donations />} />
        <Route path='/contact' element={<Contact />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/campaigns' element={<CampaignApplication />}/>
        
        {/* Admin routes with layout */}
        <Route path='/admin' element={
          <AdminPage.AdminLayout>
            <AdminPage.AdminDashboard />
          </AdminPage.AdminLayout>
        }/>
        
        <Route path='/admin/campaigns' element={
          <AdminPage.AdminLayout>
            <AdminPage.CampaignReview />
          </AdminPage.AdminLayout>
        }/>
        
        <Route path='/admin/users' element={
          <AdminPage.AdminLayout>
            <AdminPage.UserManagement />
          </AdminPage.AdminLayout>
        }/>
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;