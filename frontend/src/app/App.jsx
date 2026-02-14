// external
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// layout
import MainLayout from './layouts/MainLayout';

// auth feature
import {
  useAuthStore,
  Signup,
  Login,
  ForgetPassword,
  ResetPassword,
  ProfileSettings,
} from '@/features/auth/index';

// workout feature
import {
  Home,
  CreateWorkout,
  EditWorkout,
  ViewWorkout,
  PlayWorkout,
} from '@/features/workout/index';

// workout feature
import {
  ResultWorkout
} from '@/features/record/index';

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
          <Route
            path='/edit-workout/:workoutId'
            element={user ? <EditWorkout /> : <Navigate to='/login' />}
          />
          <Route
            path='/view-workout/:workoutId'
            element={user ? <ViewWorkout /> : <Navigate to='/login' />}
          />
          <Route
            path='/play-workout/:workoutId'
            element={user ? <PlayWorkout /> : <Navigate to='/login' />}
          />
          <Route
            path='/result-workout/:recordId'
            element={user ? <ResultWorkout /> : <Navigate to='/login' />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App;
