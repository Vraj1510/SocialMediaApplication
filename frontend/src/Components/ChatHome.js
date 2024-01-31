import React, { useEffect } from 'react';
import add1 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/Add.png';
import deletechat from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/deletechat.png';
import { useState } from 'react';
import Chat from './Chat';
import { useLocation } from 'react-router-dom';

const ChatHome = () => {
  const { state } = useLocation();
  const { username, onlineUsers } = state || {};
  const [chats, setChats] = useState([]);
  const [addFriend, setAddFriend] = useState(false);
  const [findAFriend, setFindAFriend] = useState(true);
  const [explore, setExplore] = useState(false);
  const [list, setList] = useState([]);
  const [index,setIndex]=useState(-1);

  const fetchFriendData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        username,
      });

      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch('http://localhost:3001/findfriend', requestOptions);
      const responseData1 = await response.json();
      console.log(chats);
      const filteredList = responseData1.data.filter((user1) => {
        return !chats.some((chat) => chat.username === user1.username);
      });

      console.log(filteredList);
      setList(filteredList);
    } catch (error) {
      console.error('Error fetching friend data:', error.message);
    }
  };

  const startChat = async (username, user) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user1: username,
        user2: user,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch('http://localhost:3001/addchat', requestOptions);
      await response.json();
      await getchats();
      setIndex(chats.length - 1);
      setAddFriend(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const deletechat1 = async (user1, user2) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const raw = JSON.stringify({
        user1,
        user2,
      });

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      const response = await fetch('http://localhost:3001/deletechat', requestOptions);

      if (response.ok) {
        // Wait for getchats to complete before updating the index
        setIndex((prevIndex) => Math.max(0, prevIndex - 1));
        await Promise.all([getchats(), fetchFriendData()]);

        // Ensure that the state has been updated before accessing it
      } else {
        console.error('Failed to delete chat');
      }
    } catch (err) {
      console.error(err.message);
    }
  };



  const getchats = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        username: username,
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch('http://localhost:3001/fetchchats', requestOptions);
      if (response.ok) {
        const responseData = await response.json();
        setChats(responseData.data);
        console.log(responseData);
        await fetchFriendData();
      } else {
        console.error('Failed to fetch chats');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getchats();
      await fetchFriendData();
    };

    fetchData();
  }, []);


  return (
    <div className='w-full h-screen bg-cyan-950 flex flex-row'>
      <div className='flex flex-col items-start space-y-4 p-3 w-1/4'>
        <div className='flex w-full flex-row justify-between'>
          <div className='text-white text-3xl'>Chats</div>
          <div>
            <img
              src={add1}
              onClick={() => {
                setAddFriend(true);
              }}
              className='w-[40px] h-[40px]'
            ></img>
            {addFriend && (
              <div className='fixed inset-0 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm bg-black bg-opacity-50'>
                <div className='flex flex-col items-center bg-cyan-950 p-3 w-[400px] h-[700px] rounded-lg z-50'>
                  <input className='h-[45px] w-full rounded-md p-2' placeholder='Search'></input>
                  <div className='w-full py-4 p-1'>
                    <div className='flex flex-row w-full pt-2'>
                      <button
                        className={`w-1/2 h-[45px] rounded-md text-center text-white text-xl ${
                          findAFriend ? 'bg-cyan-800' : 'bg-cyan-950'
                        }`}
                        onClick={() => {
                          setFindAFriend(true);
                          setExplore(false);
                        }}
                      >
                        Find A Friend
                      </button>
                      <button
                        className={`w-1/2 h-[45px] rounded-md text-center text-white text-xl  ${
                          findAFriend ? 'bg-cyan-950' : 'bg-cyan-800'
                        }`}
                        onClick={() => {
                          setFindAFriend(false);
                          setExplore(true);
                        }}
                      >
                        Explore
                      </button>
                    </div>
                    <div className='w-full h-[2px] bg-white'></div>
                  </div>
                  {findAFriend &&
                    list &&
                    list.map((user1) => {
                      return (
                        <div className='flex flex-row rounded-md justify-between items-center bg-white m-1.5 p-2.5 w-full'>
                          <div className='flex flex-row space-x-3 items-center'>
                            <img
                              className='w-[50px] h-[50px] rounded-full'
                              src={user1.profileImage}
                            ></img>
                            <div className='text-2xl'>{user1.username}</div>
                          </div>
                          <button
                            onClick={() => {
                              startChat(username, user1.username);
                            }}
                            className='p-2 rounded-md text-gray-800 bg-cyan-400'
                          >
                            Start A Convo!
                          </button>
                        </div>
                      );
                    })}
                  <button
                    onClick={() => {
                      setAddFriend(false);
                    }}
                    className='bg-stone-50 mt-auto h-12 w-[200px] m-3 hover:text-white text-cyan-950 hover:bg-cyan-600 px-2 py-1 mt-3 rounded-md'
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <input className='h-[45px] w-full rounded-md p-2' placeholder='Find A Chat'></input>
        {chats &&
          chats.map((chat,idx) => (
            <div
              className='w-full flex justify-between space-x-3 p-2 items-center flex-row bg-white rounded-sm mt-4 h-[70px]'
              key={chat.username}
              onClick={()=>{setIndex(idx)}}
            >
              <div className='flex flex-row items-center space-x-3'>
                <img src={chat.profileImage} className='w-[57px] h-[57px] rounded-full'></img>
                <div className='text-cyan-950 text-xl'>{chat.username}</div>
              </div>
              <img
                src={deletechat}
                onClick={() => {
                  deletechat1(username, chat.username);
                }}
                className='h-[30px] w-[30px]'
              ></img>
            </div>
          ))}
      </div>
      <div className='bg-white w-[2px]'></div>
      <div className='flex w-3/4 items-center justify-around'>
        <Chat username={username} chats={chats} index={index} onlineUsers1={onlineUsers}></Chat>
      </div>
    </div>
  );
};

export default ChatHome;
