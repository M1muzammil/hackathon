import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import "./student.css";
import "../main.css";
import { CameraFill, ArrowLeft } from 'react-bootstrap-icons';
import { baseUrl } from "../../core.mjs";
import { GlobalContext } from "../../context/context";

const Modal = (props) => {

    const { state, dispatch } = useContext(GlobalContext);

    const selectedImageRef = useRef(null);
    const fileRef = useRef();
    const { setShowModal } = props;
    const [message, setMessage] = useState("")

    const checkIn = async (event) => {

        event.preventDefault()

        if (!fileRef.current.files) {
            setMessage("Please select your image")
            return;
        }

        let formData = new FormData();
        formData.append("files", fileRef.current.files[0])

        try {
            const response = await axios.put(`${baseUrl}/api/v1/check-in/${state.user.userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            // sweet alert toast
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                title: "Check In Successfull"
            });

            event.target.reset()

            setTimeout(() => {
                setShowModal(false)
            }, [1000])


        } catch (error) {
            console.error(error);
            setMessage("Already Checked in, try later")
        }

    }

    return (
        <form onSubmit={checkIn} className='addStudentForm '>
            <div className='w-[100%]'>
                <div className='flex '>
                    <ArrowLeft className='cursor-pointer ' onClick={() => setShowModal(false)} />
                </div>
            </div>
            <input
                ref={fileRef}
                type="file"
                hidden
                id='profileImage'
                accept="image/*"
                onChange={(e) => {
                    const base64Url = URL.createObjectURL(e.target.files[0]);
                    selectedImageRef.current.src = base64Url;
                }}
            />
            <label className='cursor-pointer' htmlFor="profileImage">
                <img ref={selectedImageRef}/>
                <CameraFill className='text-[1.5em]' />
            </label>
            <p >Upload Your Selfie</p>
            <p>{message}</p>
            <button>
                <p>Check In</p>
            </button>
        </form>
    );
};

export default Modal;