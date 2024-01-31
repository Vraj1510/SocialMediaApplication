import React, { useState, useRef, useEffect } from 'react';
import logoImg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/logo.jpeg';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function OTP() {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('');
  const inputRefs = useRef([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const navigateToDashboard = (state) => {
    navigate('/dashboard', state);
  };
  const username = state && state.username;
  useEffect(async () => {
    await fetchnumber();
    await sendCode();
  }, []);
  const fetchnumber = async () => {
    const username1 = username;
    const body = { username1 };
    try {
      const response = await fetch(`http://localhost:3001/fetchnumber`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      if (responseData.success) {
        const number = responseData.data.map((item) => item.phone || '');
        setPhone(number);
        console.log(phone);
      } else {
        console.error('Update failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  console.log(username);
  async function sendCode() {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      phone_number: '91' + phone,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    await fetch('http://localhost:3001/api/send-code', requestOptions).then((response) => {
      console.log(response);
      if (response.ok === true) {
        alert('Verification code sent successfully');
      } else alert('Oh no we have an error');
    });
  }
  async function verifyCode() {
    const enteredCode = otpValues.join('');
    await fetch(`http://localhost:3001/api/verify-code`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number: phone, code: enteredCode }),
    }).then((response) => {
      console.log(response);
      if (response.ok === true) {
        alert('Number verified successfully');
        navigateToDashboard({ state: { username } });
      } else alert('Oh no we have an error');
    });
  }

  const handleInputChange = (index, value) => {
    // Allow only the first character
    const truncatedValue = value.slice(0, 1);

    const newOtpValues = [...otpValues];
    newOtpValues[index] = truncatedValue;
    setOtpValues(newOtpValues);

    // Move to the next input box if a digit is entered
    if (truncatedValue && index < otpValues.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className='flex w-screen h-screen bg-cyan-950 justify-center items-center'>
      <div className='w-1/3 h-2/3 bg-stone-50 flex flex-col justify-center items-center rounded-lg'>
        <img src={logoImg} className='h-1/3 w-1/3 pb-10 rounded-full' alt='Image Description' />
        <div className='text-lg p-2 pb-10'>Enter OTP Sent To Your Phone Number!</div>
        <div className='flex flex-row pb-10'>
          {otpValues.map((value, index) => (
            <input
              key={index}
              type='text'
              className='text-xl text-center w-14 h-14 mr-2 border-cyan-950 border-2'
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              maxLength={1} // Set maximum length to 1
            />
          ))}
        </div>
        <button
          onClick={verifyCode}
          className='h-12 w-1/2 bg-cyan-950 text-stone-50 text-lg mb-6 bg-cyan-950 placeholder-white rounded-xl hover:bg-cyan-600 hover:text-stone-50 font-semibold hover:font-semibold'
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default OTP;
