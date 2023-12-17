



import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./core.mjs";
import { GlobalContext } from "./context/context";
import Adminpanel from "./components/adminpanel/adminpanel";
import Home from "./components/Home/Home";
import Login from "./components/login/login";


const App = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.withCredentials = true;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const resp = await axios.get(`${baseUrl}/api/v1/ping`, {
          withCredentials: true,
        });
        dispatch({
          type: "USER_LOGIN",
          payload: resp.data.data,
        });
      } catch (err) {
        console.error(err);
        dispatch({
          type: "USER_LOGOUT",
        });
      }
    };

    checkLoginStatus();
  }, []);
  console.log(location.pathname);
  return (
    <div >
       {/* <div>{JSON.stringify(state)}</div> */}
      {/* <Routes>
        {state.isLogin === true && state.user && state.user.isAdmin === false && (
          <Route path="/" element={<Attendence />} />
        )}

        {state.isLogin === true && state.user && state.user.isAdmin === true && (
          <Route path="/" element={<Adminpanel />} />
        )}

        {state.isLogin === false && (
          <Route path="/" element={<Login />} />
        )}

        {state.isLogin === null && (
          <Route path="/" element={<Login />} />
        )}

        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes> */}
      <Routes>
  {state.isLogin && state.user && state.user.isAdmin === false && (
    <Route path="/" element={<Home/>} />
  )}

  {state.isLogin && state.user && state.user.isAdmin === true && (
    <Route path="/" element={<Adminpanel />} />
  )}

  {!state.isLogin && <Route path="/" element={<Login />} />}

  {state.isLogin === null && <Route path="/" element={<Login />} />}

  <Route path="*" element={<Navigate to="/" replace={true} />} />
</Routes>
    </div>
  );
};

export default App;
