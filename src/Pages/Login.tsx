import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Replace this with actual API call
        try{
            const response = await axios.post("http://localhost:8000/api/auth/login",
                {username:username,password:password}
                )
            if (response.data.message === "Login successful!") {
                localStorage.setItem("username",response.data.userInfo.username)
                console.log(response.data)
                navigate("/");
            } else {
                alert("Invalid credentials");
            }        }catch (e){
            console.log(e)
        }



    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Username"
                        className="border p-2 mb-2 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 mb-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account?{" "}
                    <button onClick={() => navigate("/signup")} className="text-blue-500">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

