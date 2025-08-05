import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useContext/useAuthContext';

import Home from "./pages/Home"
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ForgetPassword from './pages/FogetPassword';
import ResetPassword from './pages/ResetPassword';


function AppRoutes() {
  const { user, isAuthLoading } = useAuthContext();
  const location = useLocation();

  const showNavbarPaths = ['/', '/login', 'signup'];
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
