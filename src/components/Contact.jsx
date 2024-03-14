import React, { useState } from 'react';

export default function Contact(props) {
  const { username, unreadMessages, isActive, onClick, status } = props;
  const [isRead, setIsRead] = useState(false);

  // Handle click event and pass the contact ID to the parent component
  const handleClick = () => {
    onClick(props.id);
    handleRead();
  };

  // Function to toggle the isRead state
  const handleRead = () => {
    setIsRead(!isRead);
  };

  // Determine the classes based on the isActive value
  const borderXColor = isActive ? 'border-x-white' : 'border-x-indigo-900';
  const background = isActive ? 'bg-indigo-600' : 'bg-indigo-400';
  const textColor = isActive ? 'text-black' : 'text-white';

  return (
  <div  className={`main space-y-1 space-x-12 p-5 px-2 pl-4 border-x-8 ${borderXColor} ${background} text-white`} onClick={handleClick}>
      <div  className={`contact flex space-x-4`}>
      <img src={props.img_url} alt="Profile Pic" className="profile_img_container w-8 h-8 rounded-2xl" />
      <p className="profile_name">{username}</p>
      {unreadMessages > 0 && !isRead && (
        <span className="unread-count flex justify-between w-[20%]">
          <img src="../src/assets/messages.png" className='w-10 h-8' alt="Messages" /> 
          {unreadMessages}
        </span>
      )}
      </div>

      {status === "online" && (
        <span className='flex justify-between w-[24%] align-middle'>
          <img src="../src/assets/active.png" className='w-5 h-5 mt-[6%]' alt="Active" />
          <p className='text-[0.9vw]'>Active</p>
        </span>
      )}
  </div>
    
  );
}


