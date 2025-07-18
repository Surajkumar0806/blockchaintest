import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  // State for login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/login', {
        email,
        password
      });

      // Save token to localStorage
      localStorage.setItem('token', res.data.token);

      toast.success("Login successful 🎉");
      setTimeout(() => {
        navigate('/admin'); // Redirect to admin portal
      }, 1000);

    } catch (err) {
      toast.error("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default LoginPage;
