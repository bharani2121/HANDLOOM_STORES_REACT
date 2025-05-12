import { useState } from 'react';
import axios from 'axios';
import './User.css';

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    address: '',
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', form);
      alert('🛍️ Welcome to StyleCart! Your account has been created.');
    } catch (err) {
      alert('❌ Signup failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Your StyleCart Account 👗</h2>
      <form onSubmit={handleSignup}>
        <input
          name="username"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Shipping Address"
          onChange={handleChange}
          required
        />
        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Create Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
