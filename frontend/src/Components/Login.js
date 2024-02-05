import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import visible from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/visible.png';
import hidden from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/hidden.png';
import logoImg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/logo.jpeg';
import { useNavigate } from 'react-router-dom';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  var bool1 = false;
  const navigate = useNavigate();
  const navigateToDashboard = (state) => {
    navigate('/dashboard', state);
  };
  const handleImageClick = () => {
    setShowPassword(!showPassword);
  };
  const check = async () => {
    try {
      const response = await fetch('http://localhost:3001/handlelogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message);
        navigateToDashboard({ state: { username } });
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        alert('User does not exist or invalid credentials');
      }
    } catch (err) {
      console.error('Error during login:', err.message);
    }
  };

  const handleLogin = async () => {
    if (username.trim() === '') {
      alert('Please fill in username.');
    } else if (password.trim() === '') {
      alert('Please fill in password.');
    } else if (!password.match('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$')) {
      alert(
        'The password must contain atleast 8 characters, 1 capital alphabet, 1 small alphabet, 1 special character and 1 digit',
      );
    } else {
      await check();
      if (bool1) {
        navigateToDashboard({ state: { username } });
      }
    }
  };
  return (
    <div className='flex w-screen h-screen bg-stone-50 flex justify-center items-center'>
      <div className='w-1/3 h-2/3 border-[2px] shadow-lg items-center bg-stone-100 flex flex-col justify-center items-center rounded-lg'>
        <img src={logoImg} className='h-1/3 w-1/3 pb-10 rounded-full' alt='Image Description' />
        <div className='flex w-3/4 shadow-sm border-[2px] mb-8 h-12 bg-stone-50'>
          <input
            className='mb-8 w-2/3 h-10 mt-0.5 text-stone-950 text-lg border-transparent bg-stone-50 placeholder-stone-700 outline-none !important cursor-pointer p-2'
            type='text'
            placeholder='Username....'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='flex w-3/4 shadow-sm justify-between border-[2px] mb-16 h-12 bg-stone-50'>
          <input
            className='mb-8 w-2/3 h-10 mt-0.5 text-stone-950 text-lg border-transparent bg-stone-50 placeholder-stone-700 outline-none !important cursor-pointer p-2'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password....'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            onClick={handleImageClick}
            src={showPassword ? visible : hidden}
            className='bg-cyan-950 p-2 h-11.5 w-11'
          ></img>
        </div>
        <button
          onClick={handleLogin}
          className='h-10 w-1/3 bg-cyan-950 text-stone-50 text-lg mb-4 bg-cyan-950 placeholder-white rounded-xl hover:bg-cyan-600 hover:text-stone-50 font-semibold hover:font-semibold'
        >
          Login
        </button>
        <p className='text-left font-medium text-lg'>
          Create An Account?{' '}
          <Link to='/signup' className='text-cyan-800 hover:underline hover:underline-offset-2'>
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
