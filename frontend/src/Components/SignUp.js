import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/logo.jpeg';
import { useNavigate } from 'react-router-dom';
function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  var bool1 = true;
  // const fs = require('fs');
  // const fetch = require('node-fetch');
  // const path = require('path');
  const checkUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/checkUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
        }),
      });
      console.log(response);
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message);
        navigateToDashboard({ state: { username } });
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        alert('User Already Exists');
      }
    } catch (err) {
      console.error('Error during login:', err.message);
    }
  };
  const Input = async (e) => {
    e.preventDefault();
    try {
      const body = { username, password, phone };
      const response = await fetch('http://localhost:3001/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      if (responseData.success) {
        console.log('User created successfully');
      } else {
        console.error('User creation failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const navigate = useNavigate();
  const navigateToDashboard = (state) => {
    navigate('/dashboard', state);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (username.trim() === '') {
      alert('Please fill in username.');
    } else if (password.trim() === '') {
      alert('Please fill in password.');
    } else if (phone.trim() === '') {
      alert('Please fill in phone number.');
    } else if (!password.match('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$')) {
      alert(
        'The password must contain at least 8 characters, 1 capital alphabet, 1 small alphabet, 1 special character, and 1 digit',
      );
    } else if (!phone.match('^[0-9]{10}$')) {
      alert(
        'The phone number must be 10 digits long and should not contain any other characters than digits',
      );
    } else {
      await checkUser();
      await Input(e);
      // navigateToDashboard({ state: { username } });
      // }
    }
  };

  return (
    <div className='flex w-screen h-screen bg-cyan-950 flex justify-center items-center'>
      <div className='w-1/3 h-2/3 items-center bg-slate-50 flex flex-col justify-center items-center rounded-xl'>
        <img src={logoImg} className='rounded-full h-1/3 w-1/3 pb-10' alt='Image Description' />
        <input
          className='text-white mb-8 w-2/3 h-10 placeholder-white font-border-2 rounded-md border-transparent bg-cyan-950 hover:border-cyan-500 focus:border-cyan-500 !important cursor-pointer p-2'
          type='text'
          id='user_name'
          placeholder='Username....'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className='text-white mb-8 w-2/3 h-10 placeholder-white border-2 rounded-md border-transparent bg-cyan-950 hover:border-cyan-500 focus:border-cyan-500 !important cursor-pointer p-2'
          type='password'
          placeholder='Password....'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className='text-white mb-8 w-2/3 h-10 placeholder-white border-2 rounded-md border-transparent bg-cyan-950 hover:border-cyan-500 focus:border-cyan-500 !important cursor-pointer p-2'
          type='text'
          placeholder='Phone....'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={handleSignUp}
          className='h-10 w-1/3 bg-cyan-950 text-white text-lg mb-6 rounded-xl hover:bg-cyan-600 font-semibold hover:font-semibold'
        >
          SignUp
        </button>
        <p className='text-left text-cyan-900 text-lg font-semibold'>
          Already Have An Account?{' '}
          <Link to='/' className='hover:text-cyan-600'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
