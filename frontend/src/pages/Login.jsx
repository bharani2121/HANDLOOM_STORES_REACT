import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    mobile: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      try {
        const res = await axios.post('http://localhost:5000/api/users/signup', formData);
        alert('Signup successful! Please login to start shopping 🛍️');
        setIsSignup(false);
        setFormData({ username: '', email: '', address: '', mobile: '', password: '' });
      } catch (err) {
        console.error(err);
        alert('Signup failed. Please try again.');
      }
    } else {
      try {
        const res = await axios.post('http://localhost:5000/api/users/login', {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate('/');
      } catch (err) {
        console.error(err);
        alert('Login failed. Check your credentials and try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <h2>{isSignup ? 'Create Your Style Account 👗' : 'Welcome Back to Trendify 👕'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        {isSignup && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Shipping Address"
              required
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              required
              value={formData.mobile}
              onChange={handleChange}
            />
          </>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>
      <p className="toggle-auth">
        {isSignup ? 'Already have an account?' : 'New to Trendify?'}{' '}
        <span onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Login here' : 'Sign up here'}
        </span>
      </p>
    </div>
  );
}

export default Login;
