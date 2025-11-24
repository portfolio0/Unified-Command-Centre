// src/pages/Conversations.jsx
import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

export default function Conversations() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load all users
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  // Load messages for selected user
  const loadMessages = async (userId) => {
    try {
      const res = await api.get(`/conversations?userId=${userId}`);
      setMessages(res.data); // DB already sorted ASC
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Select a user
  const selectUser = async (user) => {
    setSelectedUser(user);
    await loadMessages(user.id);
  };

  // Send message (WhatsApp)
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    try {
      const res = await api.post("/conversations", {
        user_id: selectedUser.id,
        direction: "outgoing",
        message: input,
        channel: "whatsapp", // ⭐ Key for WhatsApp send
        language: "English",
        intent: null,
        sentiment: null,
      });

      // Append new message at bottom
      setMessages((prev) => [...prev, res.data]);

      setInput("");
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex h-[85vh]">
      {/* LEFT PANEL */}
      <div className="w-1/4 bg-white shadow p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>

        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => selectUser(u)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedUser?.id === u.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm">{u.phone}</p>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT PANEL */}
      <div className="w-3/4 flex flex-col bg-white shadow ml-4 rounded">
        {!selectedUser ? (
          <div className="p-8 text-gray-500 text-center">
            Select a user to view chat
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b font-bold text-lg">
              Chat with {selectedUser.name}
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 flex ${
                    msg.direction === "incoming"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 rounded max-w-xs ${
                      msg.direction === "incoming"
                        ? "bg-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}

              {/* Auto-scroll anchor */}
              <div ref={bottomRef}></div>
            </div>

            {/* SEND BAR */}
            <div className="p-4 border-t flex">
              <input
                className="border p-2 flex-1 rounded"
                placeholder="Type message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 ml-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
