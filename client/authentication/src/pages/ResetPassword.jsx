import React, { useContext, useState } from 'react'
import './ResetPassword.css';
import './EmailVerify.css';
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
const ResetPassword = () => {

const {backendUrl} = useContext(AppContent)

axios.defaults.withCredentials=true



  const [email,setEmail]=useState('')
   const [newPassword,setnewPassword]=useState('')
   const [isEmailSent, setisEmailSent]=useState('')
    const [otp, setOtp]=useState('')
    const [IsOtpSubmited, setIsOtpSubmited]=useState(false)

   const inputrefs=React.useRef([])
    
  // autoatic goto next box for input otp
    const handleInput=(e, index)=>{
      if(e.target.value.length>0 && index<inputrefs.current.length-1)
      {
          inputrefs.current[index+1].focus();
      }
      }
  
      // delete using backspace
      const handleKeyDown=(e, index)=>{
        if(e.key==='Backspace' && e.target.value===''&& index>0)
        {
          inputrefs.current[index-1].focus();
        }
  
      }
  
      // handle paste otp
      const handlePaste=(e)=>{
        const paste=e.clipboardData.getData('text')
        const pasteArray=paste.split('');
        pasteArray.forEach((CharacterData,index)=>{
          if(inputrefs.current[index])
          {
            inputrefs.current[index].value=CharacterData;
          }
        })
          
        }

  const navigate=useNavigate()
  const onSubmitEmail=async (e)=>{
    e.preventDefault();
    try {
      const {data}= await axios.post(backendUrl +'/api/auth/send-reset-otp',{email})
      data.success ? toast.success(data.message):toast.error(data.message);
       data.success && setisEmailSent(true)
    } catch (error) {
      toast.error(data.message);
      
    }
  }

  const onSubmitOTP = async (e)=>{
    e.preventDefault();
    const optArray = inputrefs.current.map(e=>e.value)
    setOtp(optArray.join(''))
    setIsOtpSubmited(true)
  }


  const onSubmitNewPassword =async (e)=>{
    e.preventDefault();
    try {
      const {data}= await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword})
      data.success ? toast.success(data.message):toast.error(data.message);
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className='login-container'>
    <img onClick= {()=>navigate('/')} src={assets.logo} alt="" className='login-logo' />

{/*Enter the Email */}

{!isEmailSent &&
    <form onSubmit={onSubmitEmail}  className='otp-form'>
       <h1 className='otp-title'>Reset Password</h1>
          <p className='otp-subtitle'>Enter your register Email address</p>
         <div className="email-input-container">
  <img src={assets.mail_icon} className="email-icon" alt=""/>
  <input
    type="email"
    placeholder="Enter Email"
    className="email-input"
    value={email}
    onChange={e => setEmail(e.target.value)}
    required
  />
</div>

<button className="submit-btn">Send OTP</button> {/* ← Add text if needed */}

    </form>
}


{/* // otp input from */}


{!IsOtpSubmited && isEmailSent &&
 <form onSubmit={onSubmitOTP}className='otp-form'>
          <h1 className='otp-title'>Reset Password OTP</h1>
          <p className='otp-subtitle'>Enter the 6-digit code sent to your email id.</p>


        <div className='otp-input-group' onPaste={handlePaste}>
          {
            Array(6).fill(0).map((__,index)=>(
              <input type='text' maxiLength='1' key={index } required
              className='otp-input'
              ref={e=>inputrefs.current[index]=e} 
              onInput={(e)=>handleInput(e,index)}
              onKeyDown={(e)=>handleKeyDown(e,index)}
              
              />

            ))
          }
        </div>
        <button className='otp-submit-btn'
        >Submit</button>

        </form>
}

        {/* Enter new password */}

     {IsOtpSubmited && isEmailSent &&    
          <form onSubmit={onSubmitNewPassword} className='otp-form'>
       <h1 className='otp-title'>New Password</h1>
          <p className='otp-subtitle'>Enter New password</p>
         <div className="email-input-container">
  <img src={assets.lock_icon} className="email-icon" alt=""/>
  <input
    type="password"
    placeholder="Enter your password"
    className="email-input"
    value={newPassword}
    onChange={e => setnewPassword(e.target.value)}
    required
  />
</div>

<button className="submit-btn">Submit</button> {/* ← Add text if needed */}

    </form>
}
          
    </div>
  );
}

export default ResetPassword
