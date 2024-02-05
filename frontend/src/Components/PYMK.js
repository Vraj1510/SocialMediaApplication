import React, { useEffect, useState } from 'react';

const PYMK = ({ username }) => {
  const [users, setUsers] = useState([]);
  const [bool1, setBool1] = useState([]);

  const requestsent1 = async (person, idx) => {
    try {
      const updatedBool1 = [...bool1];
      updatedBool1[idx] = !updatedBool1[idx];

      if (updatedBool1[idx]) {
        await sentrequest1(person);
      } else {
        await deleterequest1(person);
      }

      setBool1(updatedBool1);
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  const fetchrequests = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({ username });
      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch('http://localhost:3001/getrequests', requestOptions);
      const result = await response.json();

      if (result && result.data) {
        const updatedBool1 = new Array(users.length).fill(false);
        users.forEach((user, idx) => {
          if (result.data.find((item) => item.person2 === user.username)) {
            updatedBool1[idx] = true;
          }
        });
        setBool1(updatedBool1);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const sentrequest1 = async (person) => {
    try {
      const id = 'follow';
      const pid = -1;
      const body = { person1: username, person2: person, id, pid };
      const response = await fetch('http://localhost:3001/sentrequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);

      if (!responseData.success) {
        throw new Error(`User creation failed: ${responseData.message}`);
      }

      console.log('User created successfully');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const deleterequest1 = async (person) => {
    try {
      const body = { person1: username, person2: person };
      const response = await fetch('http://localhost:3001/deleterequest', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      // console.log(responseData);

      if (!responseData.success) {
        throw new Error(`User creation failed: ${responseData.message}`);
      }

      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const fetchpeople = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({ username });
      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch('http://localhost:3001/notfollowing', requestOptions);
      const result = await response.json();

      const filteredResult = result.data.filter((user) => user.username !== username);
      setUsers(filteredResult);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  useEffect(() => {
    fetchpeople();
  }, [username]);

  useEffect(() => {
    setBool1(new Array(users.length).fill(false));
    fetchrequests();
  }, [users]);

  return (
    <div className='flex flex-col absolute right-0 items-center w-76 space-y-6 p-3 bg-stone-100 h-[808px] m-3 rounded-lg'>
      <div className='text-cyan-950 text-3xl mb-5 m-4 bg-stone-100'>Find Friends</div>
      {users.map((user, idx) => (
        <div
          key={user.username}
          className='flex w-full flex-row items-center justify-between rounded-md bg-stone-50 shadow-md border-[2px] space-x-2 p-3 m-1'
        >
          <div className='flex flex-row items-center space-x-2'>
            <img
              src={user.profileImage}
              className='h-12 w-12 rounded-full'
              alt={user.username}
            ></img>
            <div className='text-cyan-950 text-lg'>{user.username}</div>
          </div>
          <button
            onClick={() => {
              requestsent1(user.username, idx);
            }}
            className={`text-md p-2 rounded-lg w-[100px] mr-8 h-[2.7rem] ${
              bool1[idx] ? 'text-cyan-900 bg-cyan-200' : 'bg-cyan-600 text-white'
            }`}
          >
            {bool1[idx] ? 'Requested' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PYMK;
