


import React, { useState } from 'react';
import Attend from './adminpanelstudent';
import { PlusCircleFill, BookHalf, Clipboard2CheckFill, PersonFill } from 'react-bootstrap-icons';
import './adminpanel.css';

const Login = () => {
  const [displayStudents, setDisplayStudents] = useState(true);
  const [displayAttendance, setDisplayAttendance] = useState(false);




  const handleToggleStudentsDisplay = () => {
    console.log("Toggling to Students");
    setDisplayStudents(true);
    setDisplayAttendance(false);
   
  }

  const handleToggleAttendanceDisplay = () => {
    setDisplayStudents(false);
    setDisplayAttendance(true);
  };
  return (
    <div className='main'>
      <div className='leftsection'>
        <span className='logo'>
          <BookHalf />
        </span>
        <span className={`student ${displayStudents ? 'active' : ''}`} onClick={handleToggleStudentsDisplay}>
          <p id='portal'>
            <Clipboard2CheckFill />
          </p>{' '}
          Students
        </span>
        <span className={`attandence ${displayAttendance ? 'active' : ''}`} onClick={handleToggleAttendanceDisplay}>
          <p id='portal'>
            <PersonFill />
          </p>
          Attendance
        </span>
      </div>

      <div className='rightsection' style={{ display: displayStudents ? 'block' : 'none' }}>
        
        <div className='heading'>
          <span>
            <p id='logohead'>
              <PersonFill />
            </p>
            <h1>Students</h1>
          </span>
          <button id='addstudent'>
            <PlusCircleFill /> Add Student
          </button>
        </div>
        <div className='information bg-[#0099ff] text-[#fff] w-[100%] px-[2.5em] py-[1.5em] rounded-[5px] flex items-center gap-[2.5em]'>
          <p>Id</p>
          <p>Profile Image</p>
          <p>Name</p>
          <p>Course Name</p>
          <p>Password</p>
        </div>
        <div className='informationmain '>
          <p>Id</p>
          <p>Profile Image</p>
          <p>Name</p>
          <p>Course Name</p>
          <p>Password</p>
        </div>
      </div>
      {displayAttendance ? (
        <Attend />
      ) : (
        <div style={{ display: 'none' }}>
          <Attend />
        </div>
      )}
      {/* <Attend style={{ display: displayAttendance ? 'block' : 'none' }} /> */}
    </div>
  );
};

export default Login;
