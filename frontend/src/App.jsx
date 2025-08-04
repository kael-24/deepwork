import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./pages/Home"
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import ForgetPassword from './pages/FogetPassword';
import ResetPassword from './pages/ResetPassword';

import { useAuthContext } from './hooks/useContext/useAuthContext';

function App() {
  const { user } = useAuthContext();

  return(
    <BrowserRouter>
      <Navbar />
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
    </BrowserRouter>
  )
}

export default App
