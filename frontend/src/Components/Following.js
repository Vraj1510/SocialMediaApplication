import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// const [following1,setFollowing1]=useState([]);
var following1=[];
function Following({ username }) {

  const navigate1 = useNavigate();
  const [following, setFollowing] = useState([]);
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
  const userFollowing = async () => {
    try {
      const username1 = username;
      const body = { username1 };
      const response = await fetch('http://localhost:3001/userfollowing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const responseData1 = await response.json();
      const images = responseData1.map((follower) => ({
        person1: follower.person1,
        profile: follower.profile,
      }));
      setFollowing(images);
      following1=[images];
      // setFollowing1(images);
      console.log(images);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    userFollowing();
  }, [username]);
  return (
    <div className='flex flex-col bg-stone-50'>
      {following.map((follower) => {
        return (
          <div
            onClick={() => navigatetoprofile1({ usernames: [follower.person1, username] })}
            className='flex p-2 hover:bg-cyan-900 hover:text-stone-50'
          >
            <img
              src={`data:image/png;base64,${follower.profile}`}
              className='rounded-full h-[2.3rem] w-[2.3rem]'
            ></img>
            <div className='flex w-full pt-1 ml-[0.6rem] text-[1.2rem] h-10'>
              {follower.person1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default Following;
export { following1 };