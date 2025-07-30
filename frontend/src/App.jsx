import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./pages/Home"
import Signup from './pages/Signup';
import Login from './pages/Login';
import Navbar from './components/Navbar';
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
          element={!user ? <Signup /> : <Home />}
        />
        <Route
          path='/login'
          element={!user ? <Login /> : <Home />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
