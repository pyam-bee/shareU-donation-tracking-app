import React from 'react';
import { useEffect } from 'react';
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
import TransactionHistory from './Pages/TransactionHistory';
//import { NotificationProvider } from './Components/NotificationContext';
//import { TransactionProvider } from './Components/TransactionProvider';
//import { WebSocketProvider } from './Components/WebSocketProvider';

// Create a layout component that conditionally renders the Navbar
const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';
  
  // Choose background based on route type
  let backgroundClass = "bg-charity-warm";
  
  if (isAdminRoute) {
    backgroundClass = "min-h-screen bg-admin-gradient";
  } else if (isAuthRoute) {
    backgroundClass = "min-h-screen bg-charity-warm";
  }
  
  return (
    <div className={backgroundClass}>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/donations" element={<Donations />} />
        <Route path='/contact' element={<Contact />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/campaigns' element={<CampaignApplication />}/>
        <Route path="/transactions" element={<TransactionHistory />} />
        
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

  useEffect(() => {
    // Initialize ethereum service with recipient address from configuration or environment
    const initializeEthereumService = async () => {
      try {
        // You could get this from an API, local storage, or environment variables
        const defaultWalletAddress = process.env.REACT_APP_DEFAULT_WALLET_ADDRESS;
        if (defaultWalletAddress) {
          ethereumService.setRecipientAddress(defaultWalletAddress);
        }
      } catch (error) {
        console.error('Error initializing ethereum service:', error);
      }
    };
    
    initializeEthereumService();
  }, []);

  return (
    <BrowserRouter>
            <AppLayout />
    </BrowserRouter>
  );
};

export default App;