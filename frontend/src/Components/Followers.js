import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
var followers1 = [];
function Followers({ username }) {
  const [followers, setFollowers] = useState([]);
  const navigate1 = useNavigate();

  const navigateToProfile1 = (state) => {
    const user2 = state.usernames;
    console.log(user2);
    console.log(username);
    if (user2[0] === username) {
      navigate1('/profile', { state: { username } });
    } else {
      navigate1('/profile1', { state: { usernames: [user2, username] } });
    }
  };

  const followersOfUser = async () => {
    try {
      const username1 = username;
      const body = { username1 };
      const response = await fetch('http://localhost:3001/followersofuser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const responseData1 = await response.json();
      const images = responseData1.map((follower) => ({
        person2: follower.person2,
        profile: follower.profile,
      }));
      setFollowers(images);
      followers1=[...images];
      console.log(followers1);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    followersOfUser();
  }, [username]);

  return (
    <div className='flex flex-col bg-stone-50'>
      {followers.map((follower) => (
        <div
          key={follower.person2} // Ensure each element has a unique key
          onClick={() => navigateToProfile1({ usernames: [follower.person2, username] })}
          className='flex p-2 hover:bg-cyan-900 hover:text-stone-50'
        >
          <img
            src={`data:image/png;base64,${follower.profile}`}
            className='rounded-full h-[2.3rem] w-[2.3rem]'
            alt={`${follower.person2}'s profile`}
          ></img>
          <div className='flex w-full pt-1 ml-[0.6rem] text-[1.2rem] h-10'>{follower.person2}</div>
        </div>
      ))}
    </div>
  );
}

export default Followers;
export {followers1};
