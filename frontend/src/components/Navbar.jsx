import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">TrendzWear</div>

      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/clothes">Clothes</Link></li>
          <li><Link to="/cart">Cart 🛒</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {user && isAdmin && (
            <>
              <li><Link to="/add-clothes">Add Clothes</Link></li>
              <li><Link to="/user-details">User Details</Link></li>
            </>
          )}

          {!user ? (
            <li><Link to="/login">Login</Link></li>
          ) : (
            <>
              <li style={{ color: "#e91e63" }}>
                Hello, {user.username} 👋
              </li>
              <li
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={handleLogout}
              >
                Logout
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
