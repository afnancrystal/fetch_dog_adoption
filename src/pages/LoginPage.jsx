import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLoginSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/auth/login',
        { name, email },
        { withCredentials: true }
      );
      if (response.status === 200) onLoginSuccess();
      
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="h-screen bg-beige flex items-center justify-center">
      <div className="bg-white shadow-lg rounded p-10 w-96 text-center border border-brown-500">
      <img
        src="src\assets\logo.png"
        alt="Pawtastic Logo"
        className="mx-auto mb-2 w-32"
      />
        <h1 className="text-3xl font-display font-bold text-brown-800 mb-2">Pawtastic Rescue</h1>
        <p className="text-brown-600 mb-1">Bringing Hope, One Bark at a Time </p>
        <p className="text-brown-500 italic text-sm mb-6">Powered by the Spirit of Fido</p>

        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-golden text-white font-bold py-2 px-4 rounded hover:bg-yellow-500 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
