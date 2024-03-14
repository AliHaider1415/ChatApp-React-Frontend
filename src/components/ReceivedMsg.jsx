import React from 'react';

export default function ReceivedMsg(props) {
  return (
    <div className="received_msg_container flex flex-row-reverse flex-wrap-reverse w-full pr-2 align-middle items-center">
      <img src="../src/assets/user_profile.png" alt="" className="sender_img w-8 h-8 m-2" />
      <div className="msg_desc flex space-x-2 bg-indigo-200 rounded-3xl px-4 py-2 ml-[1%]">
      <div className='space-y-2'>
        {props.message && <p>{props.message}</p>}
        {props.fileURL && <button className='bg-indigo-300 p-2 px-4 hover:bg-indigo-700 hover:text-white rounded-2xl text-[0.85em]'><a href={props.fileURL} className = ' hover:text-indigo-500' target="_blank" rel="noopener noreferrer">Download File</a></button>}
        {props.fileSize && <p className='text-[0.75em]'>Size: {props.fileSize}</p>}
      </div>
      </div>
      <p className='text-[1vw] text-slate-500 mt-[1%]'>{props.time}</p>
    </div>
  );
}
