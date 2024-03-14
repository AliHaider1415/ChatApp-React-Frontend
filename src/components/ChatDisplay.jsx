import React, { useState, useEffect, useRef, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { jwtDecode } from "jwt-decode";
import Contact from './Contact';
import ReceivedMsg from './ReceivedMsg'
import SendMsg from './SendMsg';
import './ChatDisplay.css'


export default function ChatDisplay() {
  const { auth_token, logOut } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [contacts_list, setContactsList] = useState([]);
  const [selected_receiver_id, setSelectedReceiverId] = useState(null);
  const [selected_username, setselected_username] = useState(null)
  const [search_query, setsearch_query] = useState(null)
  const [sentMsgs, setsentMsgs] = useState([]);
  const [receivedMsgs, setreceivedMsgs] = useState([]);
  const [notifications, setnotifications] = useState([]);
  const [isRead, setisRead] = useState(false)
  const [selected_file, setselected_file] = useState(null)
  
  // const [activeUsers, setactiveUsers] = useState([]); // State for managing active users in an array

  const { readyState, sendJsonMessage } = useWebSocket(`ws://127.0.0.1:8000/ws/async/?user_id=${jwtDecode(auth_token).user_id}`, {
    onOpen: () => {
      console.log("Connected!");
      // setactiveUsers([...activeUsers, jwtDecode(auth_token).user_id])
    },
    onClose: () => {
      console.log("Disconnected!");
    },
    onMessage: (e) => {
      // console.log(e);
      console.log(JSON.parse(e.data))

      if(JSON.parse(e.data).type == 'File'){
        setreceivedMsgs([...receivedMsgs, {
          sender_id: JSON.parse(e.data).sender_id,
          receiver_id: JSON.parse(e.data).receiver_id,
          message:JSON.parse(e.data).message,
          timestamp: new Date().toISOString(),
          receiver_name: selected_username,
          sender_name: jwtDecode(auth_token).username,
          fileURL: JSON.parse(e.data).fileURL,
          fileSize: JSON.parse(e.data).fileSize,
        }])
      }

      else{
        setreceivedMsgs([...receivedMsgs, {
          sender_id: JSON.parse(e.data).sender_id,
          receiver_id: JSON.parse(e.data).receiver_id,
          message:JSON.parse(e.data).message,
          timestamp: new Date().toISOString(),
          receiver_name: selected_username,
          sender_name: jwtDecode(auth_token).username,
        }])
      }

        setnotifications([...notifications, JSON.parse(e.data).sender_id])
      
    }
  });



  const fetchContacts = (username = '') => {
    const url = `http://127.0.0.1:8000/get_contacts/?username=${encodeURIComponent(username)}`;
  
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(contact_response => {
        setContactsList(contact_response);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
  };
  

  useEffect(() => {
    fetchContacts();
    console.log("Active users:")
    // console.log(activeUsers)
  }, []);

  useEffect(() => {
    // console.log("Notifications: ");
    // console.log(notifications);

  }, [selected_receiver_id, selected_username, sentMsgs, receivedMsgs, notifications]);

  useEffect(() => {
    handleFileSubmit(selected_file)
  }, [selected_file]);



  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {   // This sends message from msg prompt to the receiver
    e.preventDefault();
    setMessage("");
    if(message !="" && selected_receiver_id != null){
      sendJsonMessage({
        type: "Form Message",
        message: message,
        sender_id: jwtDecode(auth_token).user_id,
        receiver_id: selected_receiver_id,
        timestamp: new Date().toISOString(),
        receiver_name: selected_username,
        sender_name: jwtDecode(auth_token).username,
      });
      setsentMsgs([...sentMsgs, {message: message, sender_id: jwtDecode(auth_token).user_id, receiver_id: selected_receiver_id, timestamp: new Date().toISOString(), receiver_name: selected_username, sender_name: jwtDecode(auth_token).username,}]);
    }
    else{
    alert("Please Enter A Text Or Select Recipient");
    }
  };

  const handleContactClick = (contactId) => {
    setSelectedReceiverId(contactId === selected_receiver_id ? null : contactId);
  
    // Mark messages as seen
    // setreceivedMsgs(prevReceivedMsgs => {
    //   return prevReceivedMsgs.map(msg => {
    //     if (msg.receiver_id === contactId && !msg.isSeen) {
    //       return { ...msg, isSeen: true };
    //     }
    //     return msg;
    //   });
    // });
  };
  
  const handleUsernameClick = (username) => {
    setselected_username(username === selected_username ? null : username);
  };
  const handleSearchQuery = (e) => {
    e.preventDefault();
    fetchContacts(search_query); 
  }
  const handleSearchChange = (e) => {
    setsearch_query(e.target.value);
  } 
  const handleRead = () => {
    setisRead(true);
  }

  const handleLogOut = (e, user_id) =>{
    e.preventDefault();

    logOut(user_id)

  }
  
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  
  const handleFileSubmit = (file) => {
    if (!file) {
        console.error("No file selected or invalid file object.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const fileData = event.target.result;
        // Send the file data to the server
        uploadFileToServer(fileData, file);
    };
    reader.readAsDataURL(file);
    setMessage('');
    
}

const uploadFileToServer = (fileData, file) => {
  const formData = new FormData();
  formData.append('fileData', file);

  fetch('http://127.0.0.1:8000/upload_file/', {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(data => {
      const fileURL = data.fileURL;
      sendFileURL(fileURL, data.fileSize);
  })
  .catch(error => {
      console.error('Error uploading file:', error);
  });
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   
function niceBytes(x){

  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const sendFileURL = (fileURL, fileSize) => {
  console.log("this is the URL");
  console.log(fileURL);
    // Send the file URL along with other information to the client
    sendJsonMessage({
        type: "File Message",
        fileURL: fileURL,
        fileSize: fileSize,
        message: message,
        sender_id: jwtDecode(auth_token).user_id,
        receiver_id: selected_receiver_id,
        receiver_name: selected_username,
        sender_name: jwtDecode(auth_token).username,
    });

    setsentMsgs([...sentMsgs, {message: message, fileURL: fileURL, fileSize: niceBytes(fileSize), sender_id: jwtDecode(auth_token).user_id, receiver_id: selected_receiver_id, timestamp: new Date().toISOString(), receiver_name: selected_username, sender_name: jwtDecode(auth_token).username,}]);
}


  
  // const handleFileChange = (e) => {
  //   e.preventDefault();
  //   setselected_file(e.target.files[0], () => {
  //     if (selected_file) {
  //       console.log("File is changed:", selected_file);
  //       // handleFileUpload(selectedFile); // Assuming this function uses the updated file
  //     } else {
  //       console.log("No file selected");
  //     }
  //   });
  // };
  const handleFileChange = (e) => {
    e.preventDefault();
    setselected_file(e.target.files[0]);
    setMessage(e.target.files[0].name);
  };
  


  return (
    <>
      <div className="full_height bg-indigo-500" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <div className="main_container flex text-2xl">
         
          <div className="contact_list_container bg-indigo-400 w-[18vw] min-h-[6vw] min-h-auto">
            
              <form onSubmit={handleSearchQuery} className="list_settings_container flex p-5 px-1 w-full align-middle">
                <button className='p-2 px-4 py-3 rounded-[4vw] bg-indigo-400 hover:bg-indigo-600'><img src="../src/assets/hamburger.png" className='w-10 h-8' alt="Settings" /></button>
                <input type="text" className="search_input w-[90%] outline-none rounded-3xl px-8 bg-indigo-400 text-[1vw] text-white placeholder-white" value={search_query} onChange={handleSearchChange} placeholder='Search Contacts' />
                <button className='p-2 px-4 py-3 rounded-[4vw] bg-indigo-400 hover:bg-indigo-600'><img src="../src/assets/search.png" className='w-12 h-8' alt="Search" /></button>
              </form>
            
              {!contacts_list.length <= 0 ? (
                  <div className="contact_items mt-6 space-y-2 overflow-auto h-[28vw]">
                    {contacts_list.map(contact => (
                      <Contact
                        key={contact.id}
                        username={contact.username}
                        status = {contact.status}
                        img_url="../src/assets/user_profile.png"
                        onClick={() => {
                          handleContactClick(contact.id);
                          handleUsernameClick(contact.username);
                          handleRead();

                        }} 
                        isActive={contact.id === selected_receiver_id}
                        unreadMessages={notifications.filter(notification => notification === contact.id).length}
                        isRead = {isRead}
                        
                       
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center align-middle mt-4 text-white">No Contact Found</div>
                )}

          </div>
          <div className="chat_container flex flex-col content-around min-w-[50vw] w-auto">
          
            <div className="chat_info_container flex justify-between bg-white border-l-2 border-l-black space-x-[20vw] p-5">
            
              <div className="person_info_container flex justify-between space-x-4">
                <img src="../src/assets/user_profile.png" alt="Profile Pic" className='w-8 h-8' />
                <p>{!selected_username?"Select a Recipient": selected_username}</p>
              </div>
              <div className="btn_container flex space-x-6">
              <button onClick = {(e) =>{handleLogOut(e, jwtDecode(auth_token).user_id)}} className='mt-[-5%] p-2 px-4 py-3 rounded-[4vw] bg-white hover:bg-indigo-300'><img src="../src/assets/log-out.png" className='w-8 h-8' alt="Video Call" /></button>
                <img src="../src/assets/video-call.png" className='w-8 h-8' alt="Video Call" />
                <img src="../src/assets/more.png" className='w-8 h-8' alt="Settings" />
              </div>
            </div>
            {!selected_username ? (
  <div className="chat_detail_container bg-white h-[27vw] space-y-4 p-4 text-center"></div>
) : (
  <div className="chat_detail_container bg-white h-[27vw] space-y-4 p-4">
  <br />
  {[...receivedMsgs, ...sentMsgs]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((msg, index) => {
      const messageTime = new Date(msg.timestamp).toLocaleTimeString();
      if (msg.sender_id === jwtDecode(auth_token).user_id && msg.receiver_id === selected_receiver_id) {
        if (msg.fileURL) {
          return (
            <div key={index}>
              <SendMsg message={msg.message} time={messageTime} fileURL={msg.fileURL} fileSize = {msg.fileSize} />
            </div>
          );
        } else {
          return (
            <div key={index}>
              <SendMsg message={msg.message} time={messageTime} />
            </div>
          );
        }
      } else if (msg.sender_id === selected_receiver_id && msg.receiver_id === jwtDecode(auth_token).user_id) {
        if (msg.fileURL) {
          return (
            <div key={index}>
              <ReceivedMsg message={msg.message} time={messageTime} fileURL={msg.fileURL} fileSize = {msg.fileSize} />
            </div>
          );
        } else {
          return (
            <div key={index}>
              <ReceivedMsg message={msg.message} time={messageTime} />
            </div>
          );
        }
      }
      return null; // Handle other cases
    })}
</div>

)}


            <div className="prompt_container bg-white border-l-2 border-l-black min-h-[2vw] px-10 py-6 flex justify-between space-x-6">
            <button className='p-2 px-4 py-3 rounded-[4vw] bg-white hover:bg-indigo-200' onClick={handleButtonClick}><img src="../src/assets/attach.png" alt="Emoji" className="emoji_container w-10 h-8" /></button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange = {handleFileChange}
              />
              {/* <button className='p-2 px-4 py-3 rounded-[4vw] bg-white hover:bg-indigo-200' onClick={handleFileUpload}><img src="../src/assets/sending.png" alt="Emoji" className="emoji_container w-10 h-8" /></button> */}
            </div>

            <form onSubmit={handleSubmit} className="prompt_container bg-white border-l-2 border-l-black min-h-[2vw] px-10 py-6 flex justify-between space-x-6">
              <button className='p-2 px-4 py-3 rounded-[4vw] bg-white hover:bg-indigo-200'><img src="../src/assets/laugh.png" alt="Emoji" className="emoji_container w-10 h-8" /></button>
              
              <input type="text" className="prompt w-full outline-none rounded-3xl py-2 px-10 bg-slate-100" value={message} onChange={handleChange} placeholder='Enter Your Message' required/>
              <button className='p-2 px-4 py-3 rounded-[4vw] bg-white hover:bg-indigo-300'><img src="../src/assets/sending.png" alt="Send btn" className="send_btn w-8 h-8" /></button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
