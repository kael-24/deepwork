import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

// layout
import MainLayout from '@/App/layouts/MainLayout';

// auth pages
import Home from "@/features/workout/pages/Home"
import Signup from '@/features/auth/pages/Signup';
import Login from '@/features/auth/pages/Login';
import ForgetPassword from '@/features/auth/pages/ForgetPassword';
import ResetPassword from '@/features/auth/pages/ResetPassword';
import ProfileSettings from '@/features/auth/pages/ProfileSettings';

// workout pages
import CreateWorkout from '@/features/workout/pages/CreateWorkout';

function App() {
  const { user, isAuthLoading } = useAuthStore();

  if (isAuthLoading)
    return null;

  return (
    <BrowserRouter>

      <Routes>

        {/* No navbar routes */}
        <Route
          path='/forget-password'
          element={!user ? <ForgetPassword /> : <Navigate to='/' />}
        />
        <Route
          path='/reset-password'
          element={!user ? <ResetPassword /> : <Navigate to='/' />}
        />

        {/* With navbar routes */}
        <Route element={<MainLayout />}>

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
            path='/profile-settings'
            element={user ? <ProfileSettings /> : <Navigate to='/login' />}
          />
          <Route
            path='/create-workout'
            element={user ? <CreateWorkout /> : <Navigate to='/login' />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App;
