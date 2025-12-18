import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { IoArrowUndoOutline } from "react-icons/io5";

function SendBar({ input, setInput, sendMessage, toggleRecording, recording }) {
  return (
    <div className="border-t p-4 flex gap-2 items-center bg-white">
      <input
        className="flex-1 border px-3 py-2 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
      />

      {/* 🎤 TAP TO RECORD */}
      <button
        onClick={toggleRecording}
        className={`px-4 py-2 rounded text-white ${
          recording ? "bg-red-600" : "bg-gray-600"
        }`}
        title={recording ? "Stop Recording" : "Start Recording"}
      >
        {recording ? "⏹️" : "🎤"}
      </button>

      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}

export default function Conversations() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [view, setView] = useState("users");

  // 🎤 Voice
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const loadMessages = async (userId) => {
    const res = await api.get(`/conversations?userId=${userId}`);
    setMessages(res.data);
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    await loadMessages(user.id);
    if (window.innerWidth < 768) setView("chat");
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const res = await api.post("/conversations", {
      user_id: selectedUser.id,
      direction: "outgoing",
      message: input,
      channel: "whatsapp",
      language: "English",
    });

    setMessages((prev) => [...prev, res.data]);
    setInput("");
  };

  // 🎤 TAP TO RECORD LOGIC
  const toggleRecording = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("audio", audioBlob);

        await api.post(`/conversations/voice/${selectedUser.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        loadMessages(selectedUser.id);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="h-[85vh]">
      {/* ================= MOBILE ================= */}
      <div className="md:hidden h-full">
        {view === "users" && (
          <div className="h-full bg-white shadow rounded p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">Users</h2>
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => selectUser(u)}
                className="p-3 mb-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
              >
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm">{u.phone}</p>
              </div>
            ))}
          </div>
        )}

        {view === "chat" && selectedUser && (
          <div className="h-full bg-white shadow rounded flex flex-col">
            <div className="border-b p-4 flex items-center gap-3">
              <button onClick={() => setView("users")}>
                <IoArrowUndoOutline />
              </button>
              <span className="font-semibold">{selectedUser.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
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
                    {msg.message_type === "audio" && msg.media_url ? (
                      <div>
                        <audio controls className="w-64 mb-1">
                          <source
                            src={`http://localhost:5000${msg.media_url}`}
                            type="audio/ogg"
                          />
                        </audio>
                        {msg.transcription && (
                          <div className="text-sm text-gray-600 italic">
                            📝 {msg.transcription}
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.message
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <SendBar
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              toggleRecording={toggleRecording}
              recording={recording}
            />
          </div>
        )}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex h-full gap-4">
        <div className="w-1/4 bg-white shadow rounded p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-3">Users</h2>
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => selectUser(u)}
              className={`p-3 mb-2 rounded cursor-pointer ${
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

        <div className="w-3/4 bg-white shadow rounded flex flex-col">
          {selectedUser ? (
            <>
              <div className="border-b p-4 font-semibold">
                Chat with {selectedUser.name}
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
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
                      {msg.message_type === "audio" && msg.media_url ? (
                        <div>
                          <audio controls className="w-64 mb-1">
                            <source
                              src={`http://localhost:5000${msg.media_url}`}
                              type="audio/ogg"
                            />
                          </audio>
                          {msg.transcription && (
                            <div className="text-sm text-gray-600 italic">
                              📝 {msg.transcription}
                            </div>
                          )}
                        </div>
                      ) : (
                        msg.message
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <SendBar
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                toggleRecording={toggleRecording}
                recording={recording}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a user to start chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
