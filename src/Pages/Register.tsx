import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        // Replace this with actual API call
        alert("Signup successful!");
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSignup} className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-2 mb-2 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/login")} className="text-blue-500">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
