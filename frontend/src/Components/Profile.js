import React, { useState } from 'react';
import logoImg from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/logo1.png';
import { useRef } from 'react';
import Form from './Form';
import img1 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/profile1.png';
import followers from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/following.png';
import following from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/followers.png';
import edit from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/edit.png';
import save from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/save.png';
import notif from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/bell.png';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// import PeopleYMK from './PeopleYMK';
import DataHandler from './Posts';
import AddPost from './Addpost';
import Followers from './Followers';
import Following from './Following';
import Notifications from './Notifications';
let imageUrl;
function Profile() {
  const { state } = useLocation();
  const username = state && state.username;
  const inputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  var file1 = null;
  const handleImageChange = (e) => {
    file1 = e.target.files[0];
    console.log(file1);
    if (file1) {
      handleSave();
    }
  };
  const handleSave = async () => {
    var formdata = new FormData();
    formdata.append('username', username);
    formdata.append('file', file1);
    console.log(file1);
    const requestOptions = {
      method: 'POST',
      body: formdata,
    };
    await fetch('http://localhost:3001/updateprofile', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
    await fetchProfileImage();
  };
  const fetchProfileImage = async () => {
    try {
      var username1 = username;
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
      console.log(response);
      const blob = await response.blob();
      console.log(blob);
      const imageUrl = URL.createObjectURL(blob);
      console.log(imageUrl);
      setImageUrl(imageUrl);
    } catch (err) {
      console.error('Error fetching image:', err.message);
    }
  };
  const note1 = async () => {
    try {
      const body = { username, inputValue };
      console.log(inputValue);
      const response = await fetch('http://localhost:3001/updatenote', {
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
        console.log('Updated successfully');
      } else {
        console.error('Update failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const fetchnote1 = async () => {
    const username1 = username;
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
      console.log(responseData.data);
      if (responseData.success) {
        const notes = responseData.data.map((item) => item.note || '');
        console.log(notes);
        setInputValue(notes);
      } else {
        console.error('Update failed:', responseData.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleFormSubmit = (values) => {
    // Handle the form submission logic here
    console.log('Form data submitted:', values);
    // You can call the API or update the state based on the form values
    // For example, you might want to call your API to update the user profile
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsPopupOpenf(false);
    setIsPopupOpenn(false);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const [isPopupOpenf, setIsPopupOpenf] = useState(false);

  const openPopupf = () => {
    setIsPopupOpenf(!isPopupOpenf);
    setIsPopupOpen(false);
    setIsPopupOpenn(false);
  };

  const closePopupf = () => {
    setIsPopupOpenf(false);
  };

  const [isPopupOpenn, setIsPopupOpenn] = useState(false);

  const openPopupn = () => {
    setIsPopupOpenn(!isPopupOpenn);
    setIsPopupOpen(false);
    setIsPopupOpenf(false);
  };
  const closePopupn = () => {
    setIsPopupOpenn(false);
  };
  const [inputvalue, setinputvalue] = useState(true);
  const inputfunctionedit = () => {
    handleButtonClick();
    setinputvalue(false);
  };
  const inputfunctiondisable = async () => {
    setinputvalue(true);
    await note1();
  };
  const inputref = useRef(null);
  const handleButtonClick = () => {
    inputref.current.focus();
  };
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    console.log(event.target.value);
    setInputValue(event.target.value);
  };
  useEffect(() => {
    fetchnote1();
    fetchProfileImage();
  }, []);

  return (
    <div className='flex'>
      <div className='flex flex-col w-28 ml-1 items-center pt-2'>
        <div className='flex flex-col ml-12 items-center'>
          <div className='pt-4'>
            {imageUrl ? (
              <img
                src={imageUrl}
                onClick={() => inputRef.current.click()}
                className='h-[6rem] w-[6rem] cursor-pointer overflow-hidden rounded-full'
                alt='Profile'
              />
            ) : (
              <img
                src={img1}
                className='h-[6rem] w-[7rem] cursor-pointer overflow-hidden rounded-full'
                onClick={() => inputRef.current.click()}
                alt='Default Profile'
              />
            )}
            <input
              type='file'
              className='h-[5rem] w-[5rem] cursor-pointer rounded-lg'
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <text className='text-3xl align-top items font-semibold text-cyan-950'>{username}</text>
        </div>
        <div className='w-[4rem] ml-1 mt-[5rem] rounded-xl bg-cyan-950'>
          <AddPost username={username}></AddPost>
          <Form onSubmit={handleFormSubmit}></Form>
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
              onClick={openPopupn}
              className='w-[3.6rem] h-[3.4rem] mr-3 pl-1 pr-1 hover:bg-cyan-600'
              src={notif}
            ></img>
            {isPopupOpenn && (
              <div className='absolute top-[6rem] left-[13.7rem] w-[28rem] z-10 bg-cyan-950 shadow-md rounded-lg p-4'>
                <div className='text-xl text-stone-50 font-semibold mb-2'>Notifications</div>
                <Notifications className='z-2' username={username}></Notifications>
                <button
                  onClick={closePopupn}
                  className='bg-stone-50 hover:text-white text-cyan-950 hover:bg-cyan-600 px-2 py-1 mt-3 rounded-lg'
                >
                  Close
                </button>
              </div>
            )}
            <img
              src={followers}
              onClick={openPopup}
              className='w-13 h-[3.8rem] ml-32 pl-1 pr-1 pt-2 pb-1 hover:bg-cyan-600'
            ></img>
            {isPopupOpen && (
              <div className='absolute top-[6rem] left-[26rem] w-[15rem] bg-cyan-950 shadow-md rounded-lg p-4'>
                <div className='text-xl text-stone-50 font-semibold mb-2'>Followers</div>
                <Following username={username}></Following>
                <button
                  onClick={closePopup}
                  className='bg-stone-50 text-cyan-950 hover:text-white hover:bg-cyan-600 px-2 py-1 mt-3 rounded-lg'
                >
                  Close
                </button>
              </div>
            )}
            <img
              src={following}
              onClick={openPopupf}
              className='w-[4rem] h-[4rem] ml-32 pl-1 pr-1 pb-1 pt-1 mr-2 hover:bg-cyan-600'
            ></img>
            {isPopupOpenf && (
              <div className='absolute top-[6rem] left-[38.5rem] z-10 w-[15rem] w-40 bg-cyan-950 shadow-md rounded-lg p-4'>
                <div className='text-xl text-stone-50 font-semibold mb-2'>Following</div>
                <Followers username={username}></Followers>
                <button
                  onClick={closePopupf}
                  className='hover:text-white hover:bg-cyan-600 bg-stone-50 text-cyan-950 px-2 py-1 mt-3 rounded-lg'
                >
                  Close
                </button>
              </div>
            )}
          </div>
          <textarea
            disabled={inputvalue}
            ref={inputref}
            placeholder={inputValue}
            className='h-[4rem] rounded-lg ml-[6rem] mt-[1.5rem] p-1 w-[700px] placeholder-white placeholder-semibold text-semibold text-lg caret-white text-white bg-cyan-950 disabled'
            value={inputValue}
            onChange={handleInputChange}
          />
          <img
            src={edit}
            onClick={inputfunctionedit}
            className='w-11 h-10 mt-9 pr-1 pt-1 pb-1 ml-2 pl-1 bg-cyan-950 hover:bg-cyan-600'
          ></img>
          <img
            src={save}
            onClick={inputfunctiondisable}
            className='w-11 h-10 mt-9 pr-1 pt-1 pb-1 ml-2 pl-1 bg-cyan-950 hover:bg-cyan-600'
          ></img>
          {/* </div> */}
        </div>
        <div className='flex flex-row pt-1'>
          <div className='flex flex-col overflow-y-scroll mt-16 ml-[3.8rem]'>
            <div className='post-container h-[40rem] overflow-y-scroll flex-1'>
              <DataHandler username={username} image={imageUrl} />
            </div>
          </div>
          <div className='bg-cyan-950 rounded-lg mt-16 w-[16rem] ml-[3rem] h-[40rem]'>
            {/* <PeopleYMK></PeopleYMK> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
