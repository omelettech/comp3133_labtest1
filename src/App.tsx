import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import {Login} from "./Pages/Login.tsx";
import {Register} from "./Pages/Register.tsx";
import {Chatroom} from "./Pages/Chatroom.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
          <Link to={'/'}>Home</Link>
          <Link to={'/login'}>login</Link>
          <Link to={'/register'}>register</Link>

      </nav>

        <Routes>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/register"} element={<Register/>}/>
            <Route path={"/chatroom"} element={<Chatroom/>}/>
        </Routes>
    </>
  )
}

export default App
