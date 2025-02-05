import React, { createContext, useContext, useState } from "react";

interface Message {
    user: string;
    text: string;
}

interface ChatContextProps {
    room: string | null;
    messages: Message[];
    joinRoom: (room: string) => void;
    sendMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [room, setRoom] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const joinRoom = (roomName: string) => {
        setRoom(roomName);
        setMessages([]); // Reset messages when joining a new room
    };

    const sendMessage = (text: string) => {
        if (!room) return;
        setMessages((prev) => [...prev, { user: "Me", text }]);
    };

    return (
        <ChatContext.Provider value={{ room, messages, joinRoom, sendMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within ChatProvider");
    return context;
};

const RoomList = () => {
    const { joinRoom } = useChat();
    const rooms = ["General", "Tech", "Gaming", "Music"];

    return (
        <div className="w-1/3 p-4 border-r">
            <h2 className="text-lg font-bold">Rooms</h2>
            <ul>
                {rooms.map((room) => (
                    <li
                        key={room}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => joinRoom(room)}
                    >
                        {room}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const ChatArea = () => {
    const { room, messages, sendMessage } = useChat();
    const [input, setInput] = useState("");

    if (!room) return <div className="p-4">Join a room to start chatting!</div>;

    return (
        <div className="w-2/3 p-4 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Room: {room}</h2>
            <div className="flex-grow border p-2 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="mt-2 flex">
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter" && input.trim()) {
                            sendMessage(input);
                            setInput("");
                        }
                    }}
                />
                <button
                    className="ml-2 bg-blue-500 text-white p-2 rounded"
                    onClick={() => {
                        if (input.trim()) {
                            sendMessage(input);
                            setInput("");
                        }
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export const Chatroom = () => {
    return (
        <ChatProvider>
            <div className="flex h-screen">
                <RoomList />
                <ChatArea />
            </div>
        </ChatProvider>
    );
};

