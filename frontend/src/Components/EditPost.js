import React, { useEffect } from 'react';
import edit from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/edit.png';
import { useState } from 'react';
import addimage from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/add-photo.png';
import remove from '/Users/vrajshah1510/Documents/SOCIALMEDIAAPP/frontend/src/Images/remove.png';
import { useRef } from 'react';
function EditPost({ username, posts, idx, id }) {
  const [editPost, setEditPost] = useState(false);
  const fileInput = useRef(null);
  const [selectedImages, setSelectedImages] = useState(posts[idx].pictures);

  const [caption, setCaption] = useState(posts[idx].caption);
  const handleCaptionChange = (event) => {
    const caption1 = event.target.value;
    setCaption(caption1);
  };
  const handleImageDelete = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  const handlePostImageChange = async (e) => {
    const files = e.target.files;
    if (files.length + selectedImages.length > 10) {
      alert('You can only add up to 10 images.');
      return;
    }

    const newImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const buffer = await readFileAsBuffer(file);
        return {
          data: buffer,
        };
      }),
    );

    console.log(newImages);
    console.log(selectedImages);
    setSelectedImages([...selectedImages, ...newImages]);
    e.target.value = '';
  };

  const readFileAsBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = new Uint8Array(reader.result);
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handledit = () => {
    setEditPost(!editPost);
  };

  const editPostCall = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        caption: caption,
        selectedImages: selectedImages,
        id: id,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      };

      fetch('http://localhost:3001/editpost', requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));
      setEditPost(!editPost);
      console.log('Post edited successfully.');
    } catch (error) {
      console.error('Error uploading post:', error.message);
    }
  };
  return (
    <div>
      <img src={edit} onClick={handledit} className='w-[2.5rem] m-3 mt-12 h-[2.5rem]'></img>
      {editPost && (
        <div className='fixed inset-0 flex justify-center items-center z-50 backdrop-filter backdrop-blur-sm bg-black bg-opacity-50'>
          <div className='flex flex-col bg-cyan-950 p-3 w-[71rem] h-[42rem] rounded-lg z-50'>
            <textarea
              type='text'
              placeholder='Enter The Caption'
              className='w-full h-[5rem] text-lg p-1 rounded-md'
              onChange={handleCaptionChange}
              value={caption}
            ></textarea>
            <div className='flex flex-wrap'>
              {selectedImages.map((image, index) => (
                <div>
                  <img
                    src={remove}
                    onClick={() => handleImageDelete(index)}
                    className='h-6 w-6 mt-2 ml-[12.4rem]'
                  />
                  <img
                    key={index}
                    src={`data:image/png;base64,${btoa(
                      new Uint8Array(image.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                      ),
                    )}`}
                    className='h-[10rem] w-[13rem] mx-[0.4rem] object-cover cursor-pointer'
                    alt={`Image ${index}`}
                  />
                </div>
              ))}
              {selectedImages.length < 10 && (
                <div>
                  <img
                    src={addimage}
                    onClick={() => fileInput.current.click()}
                    className='bg-stone-50 h-[10rem] w-[13rem] mx-[0.4rem] mt-8 hover:text-white text-cyan-950 hover:bg-cyan-600 rounded-md'
                  />
                  <input
                    type='file'
                    ref={fileInput}
                    style={{ display: 'none' }}
                    multiple
                    onChange={handlePostImageChange}
                  />
                </div>
              )}
            </div>
            <div className='flex flex-row absolute bottom-[6rem] w-full'>
              <div className='w-3/4 '>
                <button
                  onClick={() => {
                    setEditPost(false);
                  }}
                  className='bg-stone-50 h-12 w-1/6 mr-4 hover:text-white text-cyan-950 hover:bg-cyan-600 px-2 py-1 mt-3 rounded-md'
                >
                  Close
                </button>
                <button
                  onClick={editPostCall}
                  className='bg-stone-50 h-12 w-1/6 hover:text-white text-cyan-950 hover:bg-cyan-600 px-2 py-1 mt-3 rounded-md'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EditPost;
