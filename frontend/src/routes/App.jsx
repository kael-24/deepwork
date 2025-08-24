import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

import Home from "@/pages/Home"
import Navbar from '@/components/Navbar';

import Signup from '@/pages/auth/Signup';
import Login from '@/pages/auth/Login';
import ForgetPassword from '@/pages/auth/ForgetPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import ProfileSettings from '@/pages/auth/ProfileSettings';

import CreateWorkout from '@/pages/workout/CreateWorkout';

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

function WorkoutRoutes({ user }) {
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
