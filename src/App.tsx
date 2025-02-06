import React, {useEffect, useState} from 'react'
import './App.css'
import {Link, Route, Routes, useLocation} from "react-router-dom";
import {Login} from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx";
import {Chatroom} from "./Pages/Chatroom.tsx";

function App() {
    const location = useLocation();

    const [count, setCount] = useState(0)
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("username"))
    const [routes, setRoutes] = useState();


    useEffect(() => {
        const getRoutes = () => {
            console.log("Hi")
            if (!currentUser) {

                return (
                    <>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/register"} element={<Register/>}/>
                    </>
                );
            } else {
                return (
                    <>
                        <Route path={"/chatroom"} element={<Chatroom username={currentUser}/>}/>
                    </>
                )
            }
        };
        setRoutes(getRoutes()); // Recompute routes when location changes
    }, [location, currentUser]);

    const handleLogout = () => {
        localStorage.removeItem("username")
    };
    return (
        <>
            <nav>
                <Link to={'/'}> Home </Link>
                |
                {!currentUser &&
                    (<>
                        <Link to={'/login'}> login </Link>
                        |
                        <Link to={'/register'}> register </Link>
                        |
                    </>)
                }
                {/*<Link to={'/chatroom'}> chatroom </Link>*/}

                {currentUser && <a onClick={handleLogout}> Logout </a>}
            </nav>

            <Routes>
                {/*{currentUser && <Route path={"/"} element={<Chatroom/>}/>}*/}
                {routes}
            </Routes>
        </>
    )
}

export default App
