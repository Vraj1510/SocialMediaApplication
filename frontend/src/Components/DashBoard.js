import React from 'react';
import followingimg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/following.png';
import followersimg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/followers.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Notifications from './Notifications';
import Followers from './Followers';
import Following from './Following';
import io from 'socket.io-client';
import DashBoardPosts from './DashboardPosts';
import PYMK from './PYMK';
const socket = io.connect('http://localhost:3001', { autoConnect: false });
function DashBoard() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const username = state && state.username;
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenf, setIsPopupOpenf] = useState(false);
  const [isPopupOpenn, setIsPopupOpenn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket.connect();
    socket.emit('newUser', username);
    console.log(onlineUsers);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on('user_online', (onlineUser) => {
      setOnlineUsers([...onlineUser]);
    });
    socket.on('user_offline', (onlineUser) => {
      setOnlineUsers([...onlineUser]);
    });
    console.log(onlineUsers);
    return () => {
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [socket, username]);

  useEffect(() => {
    fetchData();
  }, [username]);
  const logout = async () => {
    await socket.disconnect();
    console.log('Hello');
    navigatetologin();
  };

  const fetchData = (value) => {
    fetch('http://localhost:3001/fetch1')
      .then((response) => response.json())
      .then((json) => {
        console.log('Type of json:', typeof json);
        console.log('json:', json);

        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.user_name &&
            user.user_name.toLowerCase().includes(value.toLowerCase())
          );
        });

        console.log('Results:', results);

        const images = results.map((follower) => ({
          user_name: follower.user_name,
          profile: follower.profile,
        }));

        setList(images);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  const navigatetoprofile = (state) => {
    navigate('/profile', state);
  };
  const navigatetologin = () => {
    navigate('/');
  };

  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsPopupOpenf(false);
    setIsPopupOpenn(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const openPopupf = () => {
    setIsPopupOpenf(!isPopupOpenf);
    setIsPopupOpen(false);
    setIsPopupOpenn(false);
  };

  const closePopupf = () => {
    setIsPopupOpenf(false);
  };
  const openPopupn = () => {
    setIsPopupOpenn(!isPopupOpenn);
    setIsPopupOpen(false);
    setIsPopupOpenf(false);
  };

  const closePopupn = () => {
    setIsPopupOpenn(false);
  };
  const navigate1 = useNavigate();
  const navigatetoprofile1 = (state) => {
    var user2 = state.usernames;
    console.log(user2);
    console.log(username);
    if (user2[0] === username) {
      navigate1('/profile', { state: { username } });
    } else {
      navigate1('/profile1', { state: { usernames: [user2, username] } });
    }
  };
  const navigate2 = useNavigate();
  const navigatetochat = () => {
    navigate2('/chathome', { state: { username, onlineUsers } });
  };

  return (
    <div>
      <div className='w-screen h-screen bg-stone-50 p-1 justify-center justify-evenly'>
        <div className='flex h-12 bg-cyan-950 mt-1 ml-1 mr-1 rounded-lg justify-between'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='#FFFFFF'
            className='w-15 h-15 pl-2 p-1 hover:bg-cyan-600'
            onClick={() => navigatetoprofile({ state: { username } })}
          >
            <path
              fillRule='evenodd'
              d='M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z'
              clipRule='evenodd'
            />
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='#FFFFFF'
            className='w-15 h-15 p-1 hover:bg-cyan-600'
            onClick={openPopupn}
          >
            <path
              fillRule='evenodd'
              d='M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z'
              clipRule='evenodd'
            />
          </svg>
          {isPopupOpenn && (
            <div className='absolute top-16 left-[16.3rem] w-[30rem] bg-cyan-700 shadow-md rounded-lg p-4'>
              <div className='text-xl text-white font-semibold mb-2'>Notifications</div>
              <Notifications username={username}></Notifications>
              <button
                onClick={closePopupn}
                className='hover:bg-cyan-600 hover:text-white bg-stone-50 text-cyan-950 px-2 py-1 mt-3 rounded-lg'
              >
                Close
              </button>
            </div>
          )}
          <img
            src={followersimg}
            onClick={openPopup}
            className='w-13 h-12 p-1 hover:bg-cyan-600 pointer-events:bg-cyan-500'
          ></img>
          {isPopupOpen && (
            <div className='absolute top-16 left-[32rem] w-[16rem] bg-cyan-700 shadow-md rounded-lg p-4'>
              <div className='text-xl text-white font-semibold mb-2'>Following</div>
              <Followers username={username}></Followers>
              <button
                onClick={closePopup}
                className='hover:bg-cyan-600 m-2 hover:text-white bg-stone-50 text-cyan-950 h-[2rem] w-[5rem] rounded-lg'
              >
                Close
              </button>
            </div>
          )}
          <img
            src={followingimg}
            onClick={openPopupf}
            className='w-13 h-[3.4rem] -mt-1 hover:bg-cyan-600'
          ></img>
          {isPopupOpenf && (
            <div className='absolute top-16 left-[47rem] w-[16rem] bg-cyan-700 shadow-md rounded-lg p-4'>
              <div className='text-xl text-white font-semibold mb-2'>Followers</div>
              <Following username={username}></Following>
              <button
                onClick={closePopupf}
                className='hover:bg-cyan-600 hover:text-white bg-stone-50 text-cyan-950 px-2 py-1 mt-3 rounded-lg'
              >
                Close
              </button>
            </div>
          )}
          <div className='flex flex-row'>
            <input
              type='text'
              className='m-1 pl-1.5 w-[13rem] caret-cyan-950 bg-stone-50 placeholder-black outline-none '
              placeholder='Search..'
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            ></input>
            <ul className='border-cyan-900 rounded-md absolute w-[14rem] bg-cyan-700 top-[4rem] left-[70.5rem]'>
              <div className='flex flex-col bg-stone-50'>
                {list &&
                  list.map((user) => (
                    <li
                      onClick={() => navigatetoprofile1({ usernames: [user.user_name, username] })}
                      className='flex p-1 hover:text-white border-cyan-800 border-[1rem] rounded-lg -mb-4 hover:bg-cyan-900'
                    >
                      <img
                        src={`data:image/png;base64,${user.profile}`}
                        className='h-[3rem] w-[3rem] rounded-full'
                      ></img>
                      <div key={user.user_name} className='text p-3'>
                        {user.user_name}
                      </div>
                    </li>
                  ))}
              </div>
            </ul>
          </div>
          {/* <div className='w-15 h-15 p-1 pr-1 hover:bg-stone-50'> */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='#FFFFFF'
            className='w-15 h-15 p-1 pr-1 hover:bg-stone-50'
            onClick={() => navigatetochat()}
          >
            <path
              fillRule='evenodd'
              d='M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z'
              clipRule='evenodd'
            />
          </svg>
          {/* </div> */}
        </div>
        <div className='flex flex-row justify-between'>
          {/* <div className='w-[50rem] m-1 ml-[9rem] mt-16 rounded-lg h-[36rem] bg-cyan-950'>
            <div className='flex flex-row'> */}
          <DashBoardPosts username={username}></DashBoardPosts>
          <PYMK username={username}></PYMK>
        </div>
        <button
          onClick={() => {
            logout();
          }}
          className='bg-sky-800 text-white text-lg p-4 rounded-full'
        >
          Logout
        </button>
      </div>
    </div>
  );
}
export default DashBoard;
