import React from 'react';
import { useState } from 'react';
import logoImg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/logo.jpeg';
import followers3 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/following.png';
import following3 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/followers.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import mutual3 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/mutual.png';
function ProfileFollowing({ person1, person2, imageUrl }) {
  const [isPopupOpenf, setIsPopupOpenf] = useState(false);
  const [isPopupOpenm, setIsPopupOpenm] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [follower1, setfollower1] = useState(false);
  const [mutual, setMutual] = useState(new Map());
  const [note, setnote] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const navigate1 = useNavigate();
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
      if (responseData.success) {
        const notes = responseData.data.map((item) => item.note || '');
        setnote(notes);
      } else {
        console.error('Update failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
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
      // setfollowing2(responseData1.length);
    } catch (err) {
      console.error(err.message);
    }
  };
  const navigatetoprofile1 = (state) => {
    var user2 = state.usernames;
    refreshPage();
    navigate1('/profile1', { state: { usernames: [user2, person1] } });
    refreshPage();
  };
  const refreshPage = () => {
    window.location.reload();
  };
  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsPopupOpenf(false);
    setIsPopupOpenm(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopupf = () => {
    setIsPopupOpenf(!isPopupOpenf);
    setIsPopupOpen(false);
    setIsPopupOpenm(false);
  };

  const closePopupf = () => {
    setIsPopupOpenf(false);
  };
  const openPopupm = () => {
    setIsPopupOpenm(!isPopupOpenm);
    setIsPopupOpen(false);
    setIsPopupOpenf(false);
  };

  const closePopupm = () => {
    setIsPopupOpenm(false);
  };
  const unfollow = async () => {
    const body = { person1, person2 };
    try {
      const response = await fetch('http://localhost:3001/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const response1 = await response.json();
      await response1();
    } catch (err) {
      console.log(err.message);
    }
    refreshPage();
  };
  const removeAsFollower = async () => {
    const body = { person1, person2 };
    try {
      const response = await fetch('http://localhost:3001/removeFollower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const response1 = await response.json();
      await response1();
      setfollower1(false);
    } catch (err) {
      console.log(err.message);
    }
    refreshPage();
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
  useEffect(() => {
    fetchnote1();
    followersOfUser();
    userFollowing();
    getAllMutual();
  }, [allUsers]);

  return (
    <div className='flex'>
      <div className='flex flex-col w-28 ml-1 items-center pt-2'>
        <div className='flex flex-col ml-4 items-center'>
          <div className='pt-4'>
            <img
              src={imageUrl}
              className='h-[6rem] w-[6rem] cursor-pointer overflow-hidden rounded-full'
              alt='Profile'
            />
          </div>
          <text className='text-3xl align-top items font-semibold text-cyan-950'>{person2}</text>
        </div>
        <div className='w-[4rem] ml-1 mt-[5rem] rounded-xl bg-cyan-950'>
          <img
            src={logoImg}
            className='rounded-full h-[5rem] pl-1.5 pr-1.5 w-20 mt-20 pb-5'
            alt='Image Description'
          />
        </div>
      </div>
      <div>
        <div className='flex flex-row'>
          <div className='flex flex-row bg-cyan-950 h-[3.8rem] rounded-xl justify-between mt-7 ml-[5.8rem] pl-3'>
            <img
              src={followers3}
              onClick={openPopup}
              className='w-13 h-[3.8rem] pl-1 pr-1 pt-2 pb-1 hover:bg-cyan-600'
            ></img>
            {isPopupOpen && (
              <div className='absolute top-[5.6rem] left-[21rem] w-[16rem] bg-cyan-700 shadow-md rounded-lg p-4'>
                <div className='text-xl text-white font-semibold mb-2'>Followers</div>
                <div className='flex flex-col bg-stone-50'>
                  {followers.map((follower) => {
                    return (
                      <div
                        onClick={() =>
                          navigatetoprofile1({ usernames: [follower.person2, person1] })
                        }
                        className='flex p-2 hover:bg-cyan-900 hover:text-stone-50'
                      >
                        <img
                          src={`data:image/png;base64,${follower.profile}`}
                          className='rounded-full h-[2.3rem] w-[2.3rem]'
                        ></img>
                        <div className='flex w-full pt-1 ml-[0.6rem] text-[1.2rem] h-10'>
                          {follower.person2}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={closePopup}
                  className='hover:bg-cyan-600 m-2 hover:text-white bg-stone-50 text-cyan-950 h-[2rem] w-[5rem] rounded-lg'
                >
                  Close
                </button>
              </div>
            )}
            <img
              src={following3}
              onClick={openPopupf}
              className='w-[5rem] h-[3.8rem] ml-32 pl-1 pr-[1rem] mr-[1rem] pt-2 pb-1 hover:bg-cyan-600'
            ></img>
            {isPopupOpenf && (
              <div className='absolute top-[5.6rem] left-[25rem] w-[16rem] bg-cyan-700 shadow-md rounded-lg p-4'>
                <div className='text-xl text-white font-semibold mb-2'>Following</div>
                <div className='flex flex-col bg-stone-50'>
                  {following.map((following) => {
                    return (
                      <div
                        onClick={() =>
                          navigatetoprofile1({ usernames: [following.person1, person1] })
                        }
                        className='flex p-2 hover:bg-cyan-900 hover:text-stone-50'
                      >
                        <img
                          src={`data:image/png;base64,${following.profile}`}
                          className='rounded-full h-[2.3rem] w-[2.3rem]'
                        ></img>
                        <div className='flex w-full pt-1 ml-[0.6rem] text-[1.2rem] h-10'>
                          {following.person1}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={closePopupf}
                  className='hover:bg-cyan-600 m-2 hover:text-white bg-stone-50 text-cyan-950 h-[2rem] w-[5rem] rounded-lg'
                >
                  Close
                </button>
              </div>
            )}
            <img
              src={mutual3}
              onClick={openPopupm}
              className='w-[6rem] h-[3.8rem] ml-32 pl-1 pr-[1rem] mr-[2rem] pt-2 pb-1 hover:bg-cyan-600'
            ></img>
            {isPopupOpenm && (
              <div className='absolute top-[5.6rem] left-[39rem] w-[12rem] bg-cyan-700 shadow-md rounded-lg p-4'>
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
          </div>
          <textarea
            disabled
            className='h-[7rem] rounded-lg w-[32rem] p-[0.3rem] placeholder-white placeholder-semibold text-semibold text-lg caret-white text-white bg-cyan-950 ml-[8.8rem] mt-3 disabled'
            value={note}
          />
          <button
            onClick={unfollow}
            className='bg-cyan-950 text-white text-xl hover:bg-cyan-700 rounded-md  ml-[1rem] w-[10rem] h-[4rem] mt-8'
          >
            Unfollow
          </button>
          {follower1 && (
            <button
              onClick={removeAsFollower}
              className='bg-cyan-950 text-white text-xl hover:bg-cyan-700 rounded-md w-[10rem] h-[4rem] ml-1 mr-3 mt-8'
            >
              Remove As Follower
            </button>
          )}
        </div>
        <div className='flex flex-row pt-[4.5rem]'>
          <div className='flex flex-col ml-[3.8rem]'>
            <div className='bg-cyan-950 w-[50rem] h-[30rem] rounded-lg'>
              <div className='w-[45rem] h-[26rem] m-9 bg-cyan-950'></div>
            </div>
          </div>
          <div className='flex flex-col bg-stone-50'></div>
          <div className='bg-cyan-950 rounded-lg w-[20rem] ml-[10rem] h-[30rem]'></div>
        </div>
      </div>
    </div>
  );
}
export default ProfileFollowing;
