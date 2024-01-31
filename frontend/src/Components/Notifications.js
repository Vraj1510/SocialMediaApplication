import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Notifications({ username }) {
  const [notifications, setNotifications] = useState([]);
  const [reqsent, setReqsent] = useState(true);
  const navigate1 = useNavigate();

  const navigateToProfile = (state) => {
    const user2 = state.usernames;
    console.log(user2);
    console.log(username);
    if (user2[0] === username) {
      navigate1('/profile', { state: { username } });
    } else {
      navigate1('/profile1', { state: { usernames: [user2, username] } });
    }
  };

  const addFollowing = async (user1, user2) => {
    try {
      const body = { user1, user2 };
      const response = await fetch('http://localhost:3001/addfollowing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const responseData = await response.json();
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteRequest1 = async (user1, user2) => {
    try {
      const body = { user1, user2 };
      const response = await fetch('http://localhost:3001/deleterequest1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateNotification = async (notification) => {
    try {
      const user1 = notification.person1;
      const user2 = notification.person2;
      const id1 = notification.id;
      const pid1 = notification.pid;
      const body = { user1, user2, id1, pid1 };
      console.log(user1);
      console.log(user2);
      console.log(id1);
      console.log(pid1);
      const response = await fetch('http://localhost:3001/updatenotification', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAcceptClick = async (notification) => {
    console.log(notification.person1);
    console.log(notification.person2);
    try {
      setReqsent(false);
      deleteRequest1(notification.person1, notification.person2);
      addFollowing(notification.person1, notification.person2);
      updateNotification(notification);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const body = { username };
      const response = await fetch('http://localhost:3001/fetchnotifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }

      const responseData = await response.json();
      const updatedNotifications1 = responseData.map((notification) => ({
        ...notification,
        person1_profile: notification.person1_profile
          ? `data:image/png;base64,${notification.person1_profile}`
          : null,
        person2_profile: notification.person2_profile
          ? `data:image/png;base64,${notification.person2_profile}`
          : null,
      }));
      setNotifications(updatedNotifications1);
      console.log(updatedNotifications1);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [username]);

  return (
    <div className='bg-stone-50'>
      {notifications.map((notification) => {
        if (notification.person1 === username && notification.id === 'following') {
          return (
            <div
              key={notification.id} // Ensure each element has a unique key
              onClick={() =>
                navigateToProfile({
                  usernames: [notification.person2, notification.person1],
                })
              }
            >
              <div className='flex hover:bg-cyan-700 hover:text-white'>
                <div className='flex flex-row pl-1 h-[4rem] items-center m-2 '>
                  <img
                    src={notification.person2_profile}
                    className='w-[3rem] h-[3rem] rounded-full mr-2'
                    alt={`${notification.person2}'s profile`}
                  ></img>
                  <div className='font-medium text-xl mr-1'>{notification.person2}</div>
                  <div className='text-lg mr-2'>accepted your follow request!</div>
                </div>
              </div>
            </div>
          );
        } else if (notification.person2 === username && notification.id === 'follow') {
          if (reqsent) {
            return (
              <div
                key={notification.id} // Ensure each element has a unique key
                className='flex hover:bg-cyan-700 hover:text-white'
              >
                <div className='flex flex-row pl-1 h-[4rem] items-center m-2 '>
                  <img
                    src={notification.person1_profile}
                    className='w-[3rem] h-[3rem] rounded-full mr-2'
                    alt={`${notification.person1}'s profile`}
                  ></img>
                  <div className='font-medium text-xl mr-1'>{notification.person1}</div>
                  <div className='text-lg mr-2'>requested to follow you!</div>
                  <button
                    className='bg-cyan-950 text-white rounded-md w-[5rem] h-[2.2rem] hover:bg-cyan-600 '
                    onClick={() => handleAcceptClick(notification)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          }
          if (!reqsent) {
            return (
              <div
                key={notification.id} // Ensure each element has a unique key
                className='flex hover:bg-cyan-700 hover:text-white'
              >
                <div className='flex flex-row pl-1 h-[4rem] items-center m-2 '>
                  <img
                    src={notification.person1_profile}
                    className='w-[3rem] h-[3rem] rounded-full mr-2'
                    alt={`${notification.person1}'s profile`}
                  ></img>
                  <div className='font-medium text-xl mr-1'>{notification.person1}</div>
                  <div className='text-lg mr-2'>started following you!</div>
                </div>
              </div>
            );
          }
        } else if (notification.person2 === username && notification.id === 'following') {
          console.log(notification);
          return (
            <div
              key={notification.id} // Ensure each element has a unique key
              onClick={() =>
                navigateToProfile({
                  usernames: [notification.person1, notification.person2],
                })
              }
            >
              <div className='flex hover:bg-cyan-700 hover:text-white'>
                <div className='flex flex-row pl-1 h-[4rem] items-center m-2 '>
                  <img
                    src={notification.person1_profile}
                    className='w-[3rem] h-[3rem] rounded-full mr-2'
                    alt={`${notification.person1}'s profile`}
                  ></img>
                  <div className='font-medium text-xl mr-1'>{notification.person1}</div>
                  <div className='text-lg mr-2'>started following you!</div>
                </div>
              </div>
            </div>
          );
        }

        return null; // Add a return statement for other cases to avoid React errors
      })}
    </div>
  );
}

export default Notifications;
