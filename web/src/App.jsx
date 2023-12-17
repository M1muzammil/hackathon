import Home from "./components/Home/Home";
import Adminpanel from './components/adminpanel/adminpanel'

import Login from './components/login/login'
import { useEffect, useContext, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { GlobalContext } from "./context/context";

import "./App.css";
import axios from "axios";

import { baseUrl } from "./core.mjs";

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

    return () => {
      // cleanup function
    };
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

    return () => {
      // cleanup function
    };
  }, []);

  return (
    <div className="div">
      {/* <div>{JSON.stringify(state)}</div> */}
      {/* user routes */}
      {state.isLogin === true && state.user.isAdmin === false ? (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {state.isLogin === true && state.user.isAdmin === true ? (
        <>
          <Routes>

            <Route path="/" element={<Adminpanel/>} />

            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {/* unAuth routes */}

      {state.isLogin === false ? (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Admin" element={<Adminpanel/>} />
           
            <Route path="*" element={<Navigate to="/login" replace={true} />} />
          </Routes>
        </>
      ) : null}

      {/* splash screen */}
      {state.isLogin === null ? (
        <>
        <h1>Loading . . .</h1>
        </>
      ) : null}
    </div>
  );
};

export default App;
