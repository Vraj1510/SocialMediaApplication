import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import vraj1 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/vrajprofile.png';
import zoom from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/zoom.png';
import phone from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/phone.png';
import RoundedBtn from './RoundButton';
import { MdSearch, MdSend } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';
import { BiHappy } from 'react-icons/bi';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { BsFillMicFill } from 'react-icons/bs';
import io from 'socket.io-client';
import { Theme } from 'emoji-picker-react';
import more from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/more.png';
import EmojiPicker from 'emoji-picker-react';
const socket = io.connect('http://localhost:3001');
const Chat = ({ username, chats, index1, onlineUsers1 }) => {
  const monthdata = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daydata = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const inputRef = useRef(null);
  const [emoji, openemoji] = useState(false);
  const [message, setmessage] = useState('');
  const [messages, setmessages] = useState([]);
  const [messageReceived, setMessageReceived] = useState('');
  const [room, setRoom] = useState(0);
  const [messagesByDay, setMessagesByDay] = useState(new Map());
  const [typing, setTyping] = useState(false);
  const [typing1, setTyping1] = useState(false);
  const [index, setIndex] = useState(-1);
  console.log(onlineUsers1);
  const [onlineUsers, setOnlineUsers] = useState(onlineUsers1);
  console.log(onlineUsers);
  const getTexts = async (room) => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      room,
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
    };
    const response1 = await fetch('http://localhost:3001/getmessages', requestOptions);
    const response = await response1.json();
    setmessages(response.data);
    console.log(response);
    const messagesByDay1 = new Map();
    response.data.forEach((message) => {
      const { day, date, month, year } = message;
      const keyArray = [year, month, date, day];
      const dayKey = keyArray.join('-');
      if (!messagesByDay1.has(dayKey)) {
        messagesByDay1.set(dayKey, []);
      }

      const formattedMessage = {
        user1: message.user1,
        user2: message.user2,
        message: message.message,
        room: message.room,
        minutes: message.minutes,
        hours: message.hour,
        day: message.day,
        date: message.date,
        month: message.month,
        year: message.year,
        ampm: message.ampm,
      };
      messagesByDay1.get(dayKey).push(formattedMessage);
    });
    setMessagesByDay(messagesByDay1);
  };
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      console.log(message);
      console.log(room);
      insertmessage({ user1: username, user2: chats[index].username, message, room });
      socket.connect();
      socket.emit('send_message');
      setmessage('');
    }
  };

  const handleEmojiClick = (event) => {
    console.log(event.emoji);
    setmessage((prevInput) => prevInput + event.emoji);
  };
  const joinRoom = () => {
    socket.emit('join_room', room);
    console.log(room);
  };
  const insertmessage = async ({ user1, user2, message, room }) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      var date = new Date();
      var ampm = 'AM';
      var hours = date.getHours() % 24;
      if (date.getHours() > 12) {
        ampm = 'PM';
      }
      var raw = JSON.stringify({
        user1,
        user2,
        message,
        room: chats[index].id,
        minutes: date.getMinutes() % 60,
        hours: date.getHours() % 60,
        day: date.getDay(),
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        ampm,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch('http://localhost:3001/insertmessage', requestOptions);
      await response.json();
      await getTexts(room);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleInputChange = (e) => {
    setmessage(e.target.value);
    if (e.target.value.trim() !== '') {
      setTyping(true);
      socket.connect();
      socket.emit('typing');
    } else {
      setTyping(false);
    }
  };
  useEffect(() => {
    socket.connect();
    socket.emit('newUser', username);
  }, []);
  useEffect(() => {
    setOnlineUsers(onlineUsers1);
    setIndex(index1);
  }, [onlineUsers1, index1]);

  useEffect(() => {
    socket.connect();
    socket.on('user_online', (onlineUser) => {
      setOnlineUsers((prevOnlineUsers) => {
        const newOnlineUsers = [...new Set([...prevOnlineUsers, onlineUser])];
        return newOnlineUsers;
      });
    });
    socket.on('user_offline', (offlineUser) => {
      setOnlineUsers((prevOnlineUsers) => {
        const newOnlineUsers = prevOnlineUsers.filter((user) => user !== offlineUser);
        return newOnlineUsers;
      });
    });
    socket.on('istyping', () => {
      setTyping1(true);
    });
    return () => {
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, []);

  useEffect(() => {
    socket.connect();
    const handleReceiveMessage = () => {
      console.log('received');
      console.log(index);
      if (index !== -1) {
        getTexts(chats[index].id);
      }
    };
    socket.on('recieve_message', handleReceiveMessage);
    return () => {
      socket.off('recieve_message', handleReceiveMessage);
    };
  }, [index]);
  useEffect(() => {
    if (index !== -1) {
      getTexts(chats[index].id);
      setRoom(chats[index].id);
      joinRoom();
    }
  }, [index, chats]);

  if (index === -1) {
    return <div className='text-4xl text-white'>Start A Conversation!</div>;
  } else {
    joinRoom();
    return (
      <div className='w-full h-full justify-start'>
        <div className='flex items-center justify-between p-2 h-[60px] bg-white'>
          <div className='flex flex-row space-x-3 items-center'>
            <img src={chats[index].profileImage} className='h-[50px] w-[50px] rounded-full'></img>
            <div className='text-3xl'>{chats[index].username}</div>
            {typing1 ? (
              <div>Typing....</div>
            ) : onlineUsers.some((user) => user.username === chats[index].username) ? (
              <div>Online</div>
            ) : null}
          </div>
          <div className='flex flex-row space-x-3 p-3 items-center'>
            <img src={phone} className='h-[30px] w-[30px] rounded-full'></img>
            <img src={zoom} className='h-[40px] w-[40px] rounded-full'></img>
          </div>
        </div>
        <div className='bg-cyan-950 m-1 h-[700px]'>
          {/* {console.log(messagesByDay)} */}
          {Array.from(messagesByDay).map(([key, value]) => {
            const arr1 = key.split('-');
            arr1.map((el) => {
              return parseInt(el);
            });
            const currdate = new Date();
            let time1 = '';
            if (currdate.getFullYear() === parseInt(arr1[0], 10)) {
              if (currdate.getMonth() === parseInt(arr1[1], 10)) {
                if (currdate.getDate() === parseInt(arr1[2], 10)) {
                  time1 = 'Today';
                } else {
                  if (currdate.getDate() - parseInt(arr1[2], 10) < 7) {
                    if (currdate.getDate() - parseInt(arr1[2], 10) === 1) {
                      time1 = 'Yesterday';
                    } else {
                      time1 = daydata[parseInt(arr1[3], 10)];
                    }
                  } else {
                    time1 = arr1[2] + ' ' + daydata[parseInt(arr1[3], 10)];
                  }
                }
              } else {
                time1 =
                  arr1[2] +
                  ' ' +
                  monthdata[parseInt(arr1[1], 10) + 1] +
                  ' ' +
                  daydata[parseInt(arr1[3], 10)];
              }
            } else {
              time1 =
                arr1[2] +
                '-' +
                (parseInt(arr1[1], 10) + 1) +
                '-' +
                arr1[0] +
                ' ' +
                daydata[parseInt(arr1[3], 10)];
            }

            return (
              <div key={key} className='flex w-full flex-col'>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex-grow h-[1px] bg-gradient-to-r from-transparent to-white'></div>
                  <div className='z-10 text-white text-lg p-3'>{time1}</div>
                  <div className='flex-grow h-[1px] bg-gradient-to-r from-white to-transparent'></div>
                </div>
                {value.map((text, index) => {
                  const isCurrentUser = text.user1 === username;
                  const minutes1 = text.minutes < 10 ? '0' + text.minutes : text.minutes;
                  const hour12 = parseInt(text.hours, 10) % 12 || 12;
                  const time = hour12 + ':' + minutes1 + ' ' + text.ampm;

                  return (
                    <div key={index} className='flex flex-row items-center mr-2 justify-between'>
                      <div
                        className={`rounded p-3 m-2 mr-12 text-lg max-w-[600px] ${
                          isCurrentUser ? 'bg-white ml-auto' : 'bg-cyan-200'
                        }`}
                      >
                        {text.message}
                      </div>
                      {isCurrentUser ? (
                        <div className='flex flex-col items-end -ml-14 h-[52px] w-[80px] rounded justify-between bg-white'>
                          <img src={more} className='w-7 h-7 -mt-0.5' alt='more'></img>
                          <div className='text-sm text-gray-500 w-16 mb-1'>{time}</div>
                        </div>
                      ) : (
                        <div className='flex flex-col items-end -ml-14 mr-auto h-[52px] w-[80px] rounded justify-between bg-cyan-200'>
                          <img src={more} className='w-7 h-7 -mt-0.5' alt='more'></img>
                          <div className='text-sm text-gray-500 w-16 mb-1'>{time}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {emoji && (
            <EmojiPicker
              width={'400px'}
              height={'400px'}
              className='absolute top-[360px] left-[420px]'
              onEmojiClick={handleEmojiClick}
            ></EmojiPicker>
          )}
        </div>
        <div className='flex items-center bg-white w-full h-[60px] p-2'>
          <RoundedBtn
            onClick={() => {
              openemoji(!emoji);
            }}
            icon={<BiHappy />}
          />
          <span className='mr-2 '>
            <RoundedBtn icon={<AiOutlinePaperClip />} />
          </span>
          <input
            type='text'
            placeholder='Type a message'
            className='bg-cyan-900 rounded-lg outline-none text-lg text-neutral-200 w-[1200px] h-[50px] px-3 placeholder:text-lg placeholder:text-[#8796a1]'
            style={{ fontSize: '1.5em' }} // Adjust the '2em' value based on your preference
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            ref={inputRef}
            value={message}
          />
          <span className='ml-2'>
            {typing ? <RoundedBtn icon={<MdSend />} /> : <RoundedBtn icon={<BsFillMicFill />} />}
          </span>
        </div>
      </div>
    );
  }
};

export default Chat;
