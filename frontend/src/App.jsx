import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Clothes from './pages/Clothes';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Login from './pages/Login';
import UserDetails from './components/AllUsers';
import { useEffect, useState } from 'react';
import Checkout from './pages/Checkout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user data in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Set loading to false once we've checked localStorage
    setLoading(false);
  }, []);

  const isAdmin = user?.isAdmin;

  if (loading) {
    // Return a loading indicator or null while checking for user data
    return null; // Or a simple loading spinner
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* User-Only Routes */}
        <Route
          path="/clothes"
          element={user ? <Clothes /> : <Navigate to="/login" />}
        />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/contact"
          element={user ? <Contact /> : <Navigate to="/login" />}
        />

        {/* Admin-Only Routes */}
        <Route
          path="/add-clothes"
          element={user && isAdmin ? <AddProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-clothes/:id"
          element={user && isAdmin ? <EditProduct /> : <Navigate to="/" />}
        />
        <Route
          path="/user-details"
          element={user && isAdmin ? <UserDetails /> : <Navigate to="/" />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;