import React, { useEffect, useState } from 'react';
import like from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/like.png';
import like1 from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/like1.png';

function Like({ id, username }) {
  const [liked, setLiked] = useState(false);

  const likePostHandle = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const body1 = { id, username };
      var raw = JSON.stringify(body1);
      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch('http://localhost:3001/handlelikes', requestOptions);
      const data = await response.json();
      console.log(data);
      setLiked(data.success === 'true');
      await likePostCheck();
    } catch (error) {
      console.error('Error handling likes:', error.message);
    }
  };

  const likePostCheck = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const body1 = { id, username };
      var raw = JSON.stringify(body1);
      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch('http://localhost:3001/checklike', requestOptions);
      const data = await response.json();
      console.log(data);
      setLiked(data.success === true);
    } catch (error) {
      console.error('Error checking likes:', error.message);
    }
  };

  useEffect(() => {
    likePostCheck();
  }, []);

  return (
    <img
      onClick={likePostHandle}
      src={liked ? like1 : like}
      className='w-[2rem] h-[2rem]'
      alt='Like Icon'
    />
  );
}

export default Like;
