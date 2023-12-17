


import React, { useState , useEffect,useRef } from 'react';
import Attend from './adminpanelstudent';
import { PlusCircleFill, BookHalf, Clipboard2CheckFill, PersonFill, EyeSlashFill,EyeFill,PencilFill } from 'react-bootstrap-icons';
import './adminpanel.css';
import AddStudent from "../AddStudent/AddStudent"
import axios from 'axios'
import { baseUrl } from "../../core.mjs"
import Edit from '../editstudent/edit'
const Login = () => {
  // const [displayStudents, setDisplayStudents] = useState(true);
  // const [displayAttendance, setDisplayAttendance] = useState(false);

  // const [isEditStudent, setIsEditStudent] = useState(false)
  // const [student, setStudent] = useState()
  // const [showPass, setShowPass] = useState(false)


  // const [students, setStudents] = useState([])

  // useEffect(() => {
  //   getAllStudents()
  // }, [])

  // const getAllStudents = async () => {

  //   try {

  //     const response = await axios.get(`${baseUrl}/api/v1/students`)
  //     setStudents(response.data.data)

  //   } catch (error) {
  //     console.log(error);
  //   }

  // }
  // const handleToggleStudentsDisplay = () => {
  //   console.log("Toggling to Students");
  //   setDisplayStudents(true);
  //   setDisplayAttendance(false);
   
  // }

  // const handleToggleAttendanceDisplay = () => {
  //   setDisplayStudents(false);
  //   setDisplayAttendance(true);
  // };
  // const [modal, setModal] = useState(false);

  // const modalRef = useRef(null);




  // const editStudent = async (studentId) => {

  //   setIsEditStudent(true)

  //   try {

  //     const resp = await axios.get(`${baseUrl}/api/v1/student/${studentId}`)
  //     setStudent(resp.data.data)

  //   } catch (error) {
  //     console.log(error);
  //   }

  // }
  const [displayStudents, setDisplayStudents] = useState(true);
  const [displayAttendance, setDisplayAttendance] = useState(false);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [student, setStudent] = useState();
  const [showPass, setShowPass] = useState(false);
  const [students, setStudents] = useState([]);

  const getAllStudents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/students`);
      setStudents(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const handleToggleStudentsDisplay = () => {
    console.log("Toggling to Students");
    setDisplayStudents(true);
    setDisplayAttendance(false);
  };

  const handleToggleAttendanceDisplay = () => {
    setDisplayStudents(false);
    setDisplayAttendance(true);
  };

  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);
  const handleSubmit = async () => {
    try {
      // Code to submit the edited data, for example, using axios.put()
  
      // After a successful submission, reload the page
      window.location.reload();
    } catch (error) {
      console.error("Error submitting the form:", error);
      // Handle the error appropriately
    }
  };
  
  const editStudent = async (studentId) => {
    setIsEditStudent(true);
  
    try {
      const resp = await axios.get(`${baseUrl}/api/v1/student/${studentId}`);
      setStudent(resp.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // const editStudent = async (studentId) => {
  //   setIsEditStudent(true);
  //   try {
  //     const resp = await axios.get(`${baseUrl}/api/v1/student/${studentId}`);
  //     setStudent(resp.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
<>
{modal && <AddStudent setModal={setModal} />}
{
        isEditStudent ? <Edit setIsEditStudent={setIsEditStudent} student={student} /> : null
      }
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
          <button id='addstudent' onClick={() => setModal(true)}>
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
        {
              students ? students.map((student, index) => (
                <div key={index} className='bg-[#fff] text-[#353535] w-[100%] px-[2.5em] py-[1.5em] rounded-[5px] flex items-center gap-[2.5em]'>
                  <p className='w-[5em]'>{student._id.slice(-6)}</p>
                  <div className='w-[7em] flex justify-center items-center'><img src={student.profileImage} className='w-[2em] h-[2em] object-cover rounded-[100%]' /></div>
                  <p className='w-[8em]'>{student.firstName} {student.lastName}</p>
                  <p className='w-[7em]'>{student.course}</p>
                  <input type={showPass ? "text" : "password"} className='w-[6em]' value={student.password} readOnly />
                  <PencilFill onClick={() => { editStudent(student._id) }} className='cursor-pointer' />
                  {
                    showPass ?
                      <EyeFill className='cursor-pointer  ' onClick={() => setShowPass(!showPass)} /> :
                      <EyeSlashFill className='cursor-pointer' onClick={() => setShowPass(!showPass)}/>
                  }
                </div>
              )) : null
            }
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
    </>
  );
};

export default Login;
