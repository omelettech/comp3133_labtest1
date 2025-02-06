import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface Message {
    userInfo?: any;
    roomId: string;
    message: string;
}

interface ChatContextProps {
    room: string | null;
    messages: Message[];
    joinRoom: (username: string, room: string) => void;
    sendMessage: (username: string, text: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [room, setRoom] = useState<string | null>(null);
    const [messages, setMessages] = useState<any>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Create Socket connection when component mounts
    useEffect(() => {
        const socketInstance = io("http://localhost:8000/"); // Update to your server URL
        setSocket(socketInstance);

        // Listen for incoming messages
        socketInstance.on("message", (data: Message) => {
            console.log("Received message:", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socketInstance.disconnect(); // Clean up when component unmounts
        };
    }, []);

    const joinRoom = async (username: string, roomName: string) => {
        if (!socket) return;
        setRoom(roomName);
        // Reset messages when joining a new room
        setMessages([]);

        // Fetch the chat history from the server
        try {
            const response = await axios.get(`http://localhost:8000/api/chat/findGroup/${roomName}`);

            setMessages(response.data); // Assuming the response contains an array of messages
            console.log(roomName)
        } catch (error) {
            console.error("Error fetching messages:", error);
        }

        // Emit join-room event to the server
        socket.emit("join-room", { roomId: roomName, peerId: username });
    };

    const sendMessage = async (username: string, text: string) => {
        if (!room || !socket) return;

        const messageData: any = { username: username, roomId: room, message: text };

        // Send the message to the server and database via POST request
        try {
            await axios.post("http://localhost:8000/api/chat/sendMessage", messageData);

            // Emit the message to the room via socket
            socket.emit("send-message", messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        }
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

const RoomList = ({ username }: { username: string }) => {
    const { joinRoom } = useChat();
    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        const getRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/chat/getGroups/${username}`);
                setRooms(response.data); // Assuming response.data is an array of room objects
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        getRooms();
    }, [username]);

    return (
        <div className="w-1/3 p-4 border-r">
            <h2 className="text-lg font-bold">Rooms</h2>
            <ul>
                {rooms.length > 0 &&
                    rooms.map((room) => (
                        <li
                            key={room._id}
                            className="cursor-pointer p-2 hover:bg-gray-200"
                            onClick={() => joinRoom(username, room._id)}
                        >
                            {room.name}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

const ChatArea = ({ username }: { username: string }) => {
    const { room, messages, sendMessage } = useChat();
    const [input, setInput] = useState("");
    console.log(messages)
    if (!room) return <div className="p-4">Join a room to start chatting!</div>;
    if(!messages) return <div>No messages</div>
    return (
        <div className="w-2/3 p-4 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Room: {room}</h2>
            <div className="flex-grow border p-2 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <strong>{msg.userInfo.username}:</strong> {msg.message}
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
                            sendMessage(username, input);
                            setInput("");
                        }
                    }}
                />
                <button
                    className="ml-2 bg-blue-500 text-white p-2 rounded"
                    onClick={() => {
                        if (input.trim()) {
                            sendMessage(username, input);
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

function UserList(props: { username: string }) {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/chat/getUsers");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        getUsers();
    }, []);

    return (
        <div className="w-1/3 p-4 border-r">
            <h2 className="text-lg font-bold">Users</h2>
            <ul>
                {users.length > 0 &&
                    users.map((user) => (
                        <li key={user.username} className="cursor-pointer p-2 hover:bg-gray-200">
                            {user.username}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export const Chatroom = ({ username }: { username: string }) => {
    return (
        <ChatProvider>
            <div className="flex h-screen w-screen">
                <div className="flex flex-col w-1/3">
                    <UserList username={username} />
                    <RoomList username={username} />
                </div>
                <ChatArea username={username} />
            </div>
        </ChatProvider>
    );
};
