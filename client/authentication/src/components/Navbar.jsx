import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate= useNavigate()

    const {userData,backendUrl,setUserData,setIsLoggedin}=useContext(AppContent)
    // console.log("ye user data hai ");
    // console.log(userData);

    // verify email by send verify otp
const sendVerificationOtp = async()=>{
  try {
    axios.defaults.withCredentials=true;
    // const {data}=await axios.post(backendUrl+ '/api/auth/send-verify-otp')

    // if(data.success)
    // {
    //   navigate('/email-verify')
    //   toast.success(data.message)
    // }
    const data=await axios.post(backendUrl+ '/api/auth/send-verify-otp')
    navigate('/email-verify')
      toast.success(data.message)
    // if(data.success)
    // {
  
    // }
    // else
    //   toast.error(data.message)
    
  } catch (error) {
    toast.error(error.message)
  }
}
    const logout= async ()=>{
        try {
            axios.defaults.withCredentials=true
            const data=await axios.post(backendUrl + '/api/auth/logout')
              setIsLoggedin(false)
              setUserData(false)
               navigate('/')
            // data.success && setIsLoggedin(false)
            // data.success && setUserData(false)
            // navigate('/')
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <div className='navbar-container'>
         
      <img src={assets.logo} alt=""  className='navbar-logo'/>
      
      <br></br>
      {(userData )
      ? 
      <div className='user-dropdown'>
        {userData.name[0]}


        <div className='user-dropdown-menu'>
          {/* className='list-none m-0 p-2 bg-gray-100 text-sm' */}
            <ul >
              {/* className='py-1 px-2 hover:bg-gray-200 cursor-pointer' */}
                {!userData.isAccountVerified && <li onClick={()=>{ console.log("VE clicked!");sendVerificationOtp();}} >Verify Email</li>}
                
                {/* className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10' */}
                <li onClick={()=>{  logout(); }} >Logout</li>

            </ul>
        </div>
      </div>
      :
      
      <button onClick={()=>navigate('/login')} className='navbar-login-btn'>Login<img src={assets.arrow_icon} alt=""/></button>
}
    </div>
  )
}

export default Navbar
