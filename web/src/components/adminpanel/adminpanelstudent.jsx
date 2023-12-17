import React, { useRef, useState } from 'react'

import { PlusCircleFill, BookHalf , Clipboard2CheckFill , PersonFill , PersonCircle} from "react-bootstrap-icons"


import "./css2.css"

const Login = () => {

  return (
   <div className='main'>



<div className="rightsectionn">
   
   <div className="heading">
<span><p id='logohead'><PersonFill/></p>
<h1>Attandence</h1></span>

   </div>
 
 




  <div className='information bg-[#0099ff] text-[#fff] w-[100%] px-[2.5em] py-[1.5em] rounded-[5px] flex items-center gap-[2.5em]'>
      <p>Id</p>
      <p>Profile Image</p>
      <p>Name</p>
      <p>Check in</p>
      <p>Check out</p>
      </div> 

      <div className='informationmain '>
      <p>Id</p>
      <p><PersonCircle/></p>
      <p>Name</p>
      <p>Check in</p>
      <p>Check out</p>
      </div> 
</div>


      </div>

   
  )
}

export default Login
