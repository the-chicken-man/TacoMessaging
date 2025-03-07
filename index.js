import { useState, useEffect } from 'react';
import { AblyProvider, useChannel } from 'ably/react';
import Ably from 'ably/promises';

const ably = new Ably.Realtime({ key: ' lVA-Ww.euAtyw:E6oSsLx8M_AC2tN8kF2mLZ-YWmi3FJiE_a1b7vzCIYY ', clientId: 'anon' });

export default function ChatApp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [chatRoom, setChatRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { channel, sendMessage } = useChannel(chatRoom, (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  const joinChat = () => {
    if (email) {
      setChatRoom(email);
    }
  };

  return (
    <AblyProvider client={ably}>
      <div className="p-4 w-full max-w-md mx-auto bg-gray-900 text-white rounded-xl">
        <h2 className="text-xl font-bold">Chat App</h2>
        {!chatRoom ? (
          <div>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 my-2 rounded bg-gray-700"
            />
            <input
              type="text"
              placeholder="Enter email to chat"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 my-2 rounded bg-gray-700"
            />
            <button onClick={joinChat} className="w-full p-2 bg-blue-500 rounded">Join Chat</button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg">Chatting with {chatRoom}</h3>
            <div className="h-64 overflow-y-auto bg-gray-800 p-2 rounded">
              {messages.map((msg, index) => (
                <div key={index} className="p-1 border-b border-gray-700">
                  <strong>{msg.name}:</strong> {msg.data}
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 my-2 rounded bg-gray-700"
            />
            <button
              onClick={() => {
                sendMessage({ name: username, data: message });
                setMessage('');
              }}
              className="w-full p-2 bg-green-500 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </AblyProvider>
  );
}
