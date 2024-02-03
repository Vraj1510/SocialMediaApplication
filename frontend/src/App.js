import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import Dashboard from './Components/DashBoard';
import Profile from './Components/Profile';
import Profile1 from './Components/Profile1';
import OTP from './Components/OTP';
import ChatHome from './Components/ChatHome';
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile1' element={<Profile1 />} />
        <Route path='/otp' element={<OTP />} />
        <Route path='/chathome' element={<ChatHome />} />
      </Routes>
    </div>
  );
}

export default App;
