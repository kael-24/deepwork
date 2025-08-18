import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

import Home from "@/pages/Home"
import Signup from '@/features/auth/pages/Signup';
import Login from '@/features/auth/pages/Login';
import Navbar from '@/components/Navbar';
import ForgetPassword from '@/features/auth/pages/FogetPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import ProfileSettings from '@/features/auth/pages/ProfileSettings';

import CreateWorkout from '@/features/workout/pages/CreateWorkout';

function AuthRoutes({ user, excludeNavbar }) {
  return(
    <>
      {!excludeNavbar && <Navbar />}
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
        <Route 
          path='/profile-settings'
          element={user ? <ProfileSettings /> : <Navigate to='/login' />}
        />
      </Routes>
    </>
  )
}

function WorkoutRoutes({ user, showNavbar }) {
  return(
    <Routes>
      <Route
        path='/create-workout'
        element={user ? <CreateWorkout /> : <Navigate to ='/login' />}
      />
    </Routes>
  );
}

function AppRoutes() {
  const { user, isAuthLoading } = useAuthStore();
  const location = useLocation();

  const excludeNavbarPaths = ['/forget-password', '/reset-password'];
  const excludeNavbar = excludeNavbarPaths.includes(location.pathname);

  if (isAuthLoading) 
    return null;
  
  return(
    <>
      <AuthRoutes user={user} excludeNavbar={excludeNavbar}/>
      <WorkoutRoutes user={user} excludeNavbar={excludeNavbar}/>
    </>
  )
}

function App(){
  return(
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App;
