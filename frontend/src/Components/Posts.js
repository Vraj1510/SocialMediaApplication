import React, { useState } from 'react';
import leftarrow from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/left-arrow.png';
import rightarrow from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/right-arrow.png';
import like from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/like.png';
import comment from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/comment.png';
import share from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/share.png';
import bin from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/bin.png';
import { useEffect } from 'react';
import EditPost from './EditPost';
import Like from './Like';
import { useRef } from 'react';
export const fetchPost = async (username) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      username1: username,
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    const response = await fetch('http://localhost:3001/fetchpost', requestOptions);
    const result = await response.json();
    return { posts: result.data, currentImageIndex: new Array(result.data.length).fill(0) };
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
  return {};
};
const Posts = ({ username, image }) => {
  const [comment1, setComment] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState([]);
  const handleNextImage = (post1, idx) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndexes = [...prevIndex];
      console.log(post1.length);
      console.log(newIndexes[idx]);
      if (newIndexes[idx] < post1.length - 1) {
        newIndexes[idx] += 1;
      }
      return newIndexes;
    });
  };

  const handlePreviousImage = (post1, idx) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndexes = [...prevIndex];
      if (newIndexes[idx] > 0) {
        newIndexes[idx] -= 1;
      }
      return newIndexes;
    });
  };

  const DeletePost = async (id) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        id: id,
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch('http://localhost:3001/deletepost', requestOptions);
      await response.json();
      const { posts: updatedPosts, currentImageIndex: updatedCurrentImageIndex } = await fetchPost(
        username,
      );
      setPosts(updatedPosts);
      setCurrentImageIndex(updatedCurrentImageIndex);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { posts: updatedPosts, currentImageIndex: updatedCurrentImageIndex } =
          await fetchPost(username);
        setPosts(updatedPosts);
        setCurrentImageIndex(updatedCurrentImageIndex);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };

    fetchData();
    return () => {};
  }, []);

  return (
    <div className="post-container h-[40rem] style={{ overflowY: 'scroll', flex: '1' }}">
      {posts &&
        posts.map((post, idx) => (
          <div key={idx} className='flex flex-row bg-cyan-950 mb-2 w-[70rem] h-[40rem] rounded-lg'>
            <div className='flex my-5 ml-3 flex w-[6rem] flex-col'>
              <img
                src={image}
                className='h-[4.4rem] w-[4.4rem] m-1 border-[0.2rem] border-white cursor-pointer overflow-hidden rounded-full'
                alt='Profile'
              />
              <Like id={post.id} username={username}></Like>
              <img
                src={comment}
                onClick={() => setComment(!comment1)}
                className='w-[2.5rem] m-3 mt-12 h-[2.5rem]'
              ></img>
              {comment1 && (
                <div>
                  <div className='fixed inset-0 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm bg-black bg-opacity-50'>
                    <div className='flex flex-col bg-cyan-950 p-3 w-[71rem] h-[49rem] rounded-lg z-50'>
                      <div className='text-4xl text-white'>Comments</div>
                      <button
                        onClick={() => setComment(!comment1)}
                        className='bg-stone-50 h-12 w-1/6 m-3 hover:text-white text-cyan-950 hover:bg-cyan-600 px-2 py-1 mt-3 rounded-md'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <img src={share} className='w-[2.5rem] m-3 mt-12 h-[2.5rem]'></img>
              {/* <img src={edit} className='w-[2.5rem] m-3 mt-12 h-[2.5rem]'></img> */}
              <EditPost username={username} id={post.id} idx={idx} posts={posts}></EditPost>
              <img
                src={bin}
                onClick={() => {
                  DeletePost(post.id);
                }}
                className='w-[2.5rem] m-3 mt-12 h-[2.5rem]'
              ></img>
            </div>
            <div className='flex w-full h-1/4 flex-col items-start'>
              <div className='flex flex-row mt-3'>
                <div className='text-white mt-7 text-4xl'>{post.username}</div>
                <textarea
                  disabled
                  className='w-[53.7rem] h-[4rem] p-2 text-xl bg-white rounded-md ml-10 mt-5'
                >
                  {post.caption}
                </textarea>
              </div>
              <div className='flex flex-row'>
                {post.pictures && post.pictures.length > 0 && (
                  <div className='flex w-full ml-[1rem] flex-row relative'>
                    <img
                      src={leftarrow}
                      className='h-[2rem] w-[2rem] mt-[15rem] -ml-[2rem] cursor-pointer absolute left-0'
                      onClick={() => handlePreviousImage(post.pictures, idx)}
                    />
                    {post.pictures[currentImageIndex[idx]] && (
                      <img
                        key={currentImageIndex[idx]}
                        src={`data:image/png;base64,${btoa(
                          new Uint8Array(post.pictures[currentImageIndex[idx]].data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                          ),
                        )}`}
                        alt={`Post Image ${currentImageIndex[idx]}`}
                        className='mt-12 h-[29rem] w-[60rem] object-cover'
                      />
                    )}
                    <img
                      src={rightarrow}
                      className='h-[2rem] w-[2rem] mt-[15rem] -mr-[2rem] cursor-pointer absolute right-0'
                      onClick={() => handleNextImage(post.pictures, idx)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Posts;
