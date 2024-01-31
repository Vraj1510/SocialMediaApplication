import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import followers3 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/following.png';
import following3 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/followers.png';
import ProfileFollowing from './profileFollowing';
import { useNavigate } from 'react-router-dom';
import mutual3 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/mutual.png';
function Profile1() {
  const state = useLocation().state;
  const user2 = state && state.usernames;
  const person1 = user2[1];
  const person2 = user2[0][0];
  const [followers2, setfollowers2] = useState(0);
  const [following2, setfollowing2] = useState(0);
  const [following1, setfollowing1] = useState(false);
  const [requestsent, setrequestsent] = useState(false);
  const [text, settext] = useState('Follow');
  const [note, setnote] = useState('');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [follower1, setfollower1] = useState(false);
  const [mutual, setMutual] = useState(new Map());
  const fetchImage = async () => {
    try {
      var username1 = person2;
      const body = { username1 };
      const response = await fetch('http://localhost:3001/fetchImage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (err) {
      console.error('Error fetching image:', err.message);
    }
  };

  const [isPopupOpenf, setIsPopupOpenf] = useState(false);
  const [isPopupOpenm, setIsPopupOpenm] = useState(false);
  const openPopupm = () => {
    setIsPopupOpenm(!isPopupOpenm);
    setIsPopupOpen(false);
    setIsPopupOpenf(false);
  };

  const closePopupm = () => {
    setIsPopupOpenm(false);
  };
  const checkfollower = async () => {
    try {
      const body = { person2, person1 };
      const response = await fetch('http://localhost:3001/checkfollower', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      if (responseData.data.length > 0) {
        setfollower1(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const sentrequest1 = async () => {
    try {
      const id = 'follow';
      const pid = -1;
      const body = { person1, person2, id, pid };
      const response = await fetch('http://localhost:3001/sentrequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.success) {
        console.log('User created successfully');
      } else {
        console.error('User creation failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const deleterequest1 = async () => {
    try {
      const body = { person1, person2 };
      const response = await fetch('http://localhost:3001/deleterequest', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      // console.log(responseData);
      if (responseData.success) {
        console.log('User created successfully');
      } else {
        console.error('User creation failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const fetchnote1 = async () => {
    const username1 = person2;
    const body = { username1 };
    try {
      const response = await fetch(`http://localhost:3001/fetchnote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      // console.log(responseData);
      if (responseData.success) {
        const notes = responseData.data.map((item) => item.note || '');
        // console.log('Notes:', notes);
        setnote(notes);
      } else {
        console.error('Update failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const followingcondition = async () => {
    try {
      const body = { person1, person2 };
      const response = await fetch('http://localhost:3001/follow', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      if (responseData.data.length === 1) {
        setfollowing1(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const requestcondition = async () => {
    try {
      const body = { person1, person2 };
      const response = await fetch('http://localhost:3001/requestsent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }
      const responseData = await response.json();
      if (responseData.data.length === 1) {
        setrequestsent(true);
        setbool1(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const [bool1, setbool1] = useState(false);
  const requestsent1 = async () => {
    setbool1(!bool1);
    var bool2 = !bool1;
    if (bool2) {
      sentrequest1();
    } else {
      deleterequest1();
    }
  };
  const followersOfUser = async () => {
    try {
      const username1 = person2;
      const body = { username1 };
      const response = await fetch('http://localhost:3001/followersofuser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const responseData1 = await response.json();
      const images = await responseData1.map((follower) => ({
        person2: follower.person2,
        profile: follower.profile,
      }));
      setFollowers(images);
      setfollowers2(responseData1.length);
    } catch (err) {
      console.error(err.message);
    }
  };
  const navigate1 = useNavigate();

  const userFollowing = async () => {
    try {
      const username1 = person2;
      const body = { username1 };
      const response = await fetch('http://localhost:3001/userfollowing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const responseData1 = await response.json();
      const images = await responseData1.map((follower) => ({
        person1: follower.person1,
        profile: follower.profile,
      }));
      setFollowing(images);
      setfollowing2(responseData1.length);
    } catch (err) {
      console.error(err.message);
    }
  };
  const fetchAll = async () => {
    try {
      const response = await fetch('http://localhost:3001/fetch1', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const response1 = await response.json();
      const data1 = await response1.map((uservar) => ({
        user_name: uservar.user_name,
        profile: uservar.profile,
      }));
      setAllUsers(data1);
    } catch (err) {
      console.error(err.message);
    }
  };
  const getAllMutual = async () => {
    const mutualData = new Map();
    await fetchAll();
    try {
      const mutualPromises = allUsers.map(async (user) => {
        const user1 = person1;
        const user2 = user.user_name;
        const body = { user1, user2 };
        const response = await fetch('http://localhost:3001/mutual', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const responseData1 = await response.json();
        const data1 = await responseData1.map((mutual1) => ({
          person2: mutual1.person2,
          profile: mutual1.profile,
        }));
        mutualData.set(user2, data1);
      });

      await Promise.all(mutualPromises);
      setMutual(mutualData);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    checkfollower();
    followingcondition();
    requestcondition();
    fetchnote1();
    followersOfUser();
    userFollowing();
    fetchImage();
    getAllMutual();
  }, [allUsers]);

  if (following1) {
    return (
      <ProfileFollowing person1={person1} person2={person2} imageUrl={imageUrl}></ProfileFollowing>
    );
  } else {
    return (
      <div className='flex flex-col items-center'>
        <div className='flex flex-row h-[16rem] w-[90rem] justify-between rounded-lg items-center m-4 bg-cyan-950'>
          <div className='flex flex-col justify-evenly items-center ml-7'>
            <img src={imageUrl} className='w-[10rem] h-[10rem] rounded-full'></img>
            <div className='text-white text-3xl mt-3'>{person2}</div>
          </div>
          <div className='flex flex-col items-center'>
            <img src={followers3} className='w-[4rem] h-[5rem]'></img>
            <div className='text-5xl font-light text-white'>{following2}</div>
          </div>
          <div className='flex flex-col items-center -mb-3'>
            <img src={following3} className='w-[4rem] h-[3.8rem]'></img>
            <div className='text-5xl font-light text-white mr-3 mt-1'>{followers2}</div>
          </div>
          <div className='flex flex-col'>
            <img
              src={mutual3}
              onClick={openPopupm}
              className='w-[5rem] h-[4rem] hover:bg-cyan-600'
            ></img>
            {isPopupOpenm && (
              <div className='absolute top-[10rem] left-[38rem] w-[12rem] bg-cyan-700 shadow-md rounded-lg p-4'>
                <div className='text-xl text-white font-semibold mb-2'>You Both Follow</div>
                <div className='flex flex-col bg-stone-50'>
                  {mutual.get(person2) ? (
                    mutual.get(person2).map((mutual1) => {
                      return (
                        <div className='flex m-2'>
                          <img
                            src={`data:image/png;base64,${mutual1.profile}`}
                            className='h-[3rem] w-[3rem] rounded-full'
                          ></img>
                          <div className='flex w-full pt-1 ml-[0.6rem] text-[1.2rem] h-10'>
                            {mutual1.person2}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div></div>
                  )}
                </div>
                <button
                  onClick={closePopupm}
                  className='hover:bg-cyan-600 m-2 hover:text-white bg-stone-50 text-cyan-950 h-[2rem] w-[5rem] rounded-lg'
                >
                  Close
                </button>
              </div>
            )}
            {mutual.get(person2) ? (
              <div className='text-5xl text-white ml-5 mt-3'>{mutual.get(person2).length}</div>
            ) : (
              <div className='text-5xl text-white ml-5 mt-3'>0</div>
            )}
          </div>
          <textarea
            value={note}
            className='h-[13rem] rounded-lg w-[32rem] text-semibold text-lg text-cyan-950 bg-stone-50 disabled pointer-events-none'
          />
          <button
            onClick={requestsent1}
            value={text}
            className={`font-md text-2xl rounded-lg mr-8 w-[11rem] h-[3.5rem] ${
              bool1 ? 'bg-cyan-600 text-white' : 'bg-white'
            } `}
          >
            {bool1 ? 'Request Sent' : 'Follow'}
          </button>
        </div>
        <div className='h-[28rem] w-[90rem] -mt-2 rounded-lg bg-cyan-950'></div>
      </div>
    );
  }
}

export default Profile1;
