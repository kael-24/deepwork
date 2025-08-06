import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

import Home from "@/pages/Home"
import Signup from '@/features/auth/pages/Signup';
import Login from '@/features/auth/pages/Login';
import Navbar from '@/components/Navbar';
import ForgetPassword from '@/features/auth/pages/FogetPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';


function AppRoutes() {
  const { user, isAuthLoading } = useAuthStore();
  const location = useLocation();

  const showNavbarPaths = ['/', '/login', '/signup'];
  const showNavbar = showNavbarPaths.includes(location.pathname);

  if (isAuthLoading) 
    return null;
  
  return(
    <>
      {showNavbar && <Navbar />}
        <Routes>
          <Route 
            path='/'
            element={<Home />}
          />
          <Route
            path='/signup'
            element={!user ? <Signup /> : <Navigate to='/' />}
          />
          <Route
            path='/login'
            element={!user ? <Login /> : <Navigate to='/' />}
          />
          <Route 
            path='/forget-password'
            element={!user ? <ForgetPassword /> : <Navigate to='/' />}
          />
          <Route 
            path='/reset-password'
            element={!user ? <ResetPassword /> : <Navigate to='/' />}
          />
        </Routes>
    </>
  )
}

function App() {
  return(
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
