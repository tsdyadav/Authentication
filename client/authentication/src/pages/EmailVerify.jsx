import React, { useContext, useEffect } from 'react'
import './EmailVerify.css';
import { assets } from '../assets/assets'
import { AppContent } from '../context/Appcontext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const EmailVerify = () => {

  axios.defaults.withCredentials=true;
  const {backendUrl,isLoggedin, userData, getUserData}=useContext(AppContent)
  const navigate=useNavigate()

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
    
      const onSubmitHandler =async(e)=>{
        try {
          const optArray= inputrefs.current.map(e=>e.value)
          const otp=optArray.join('')
          const {data}= await axios.post(backendUrl+'/api/auth/verify-account',{otp})
          if(data.success)
          {
            toast.success(data.message)
            getUserData()
            navigate('/')
          }
          else
            toast.error(data.message)
        } catch (error) {
          toast.error(data.message)
        }
      }

  
  useEffect(()=>{
    isLoggedin&& userData&& userData.isAccountVerified && navigate('/')
  },[isLoggedin,userData])
  return (
    <div className='login-container'>
        <img onClick= {()=>navigate('/')} src={assets.logo} alt="" className='login-logo' />
        <form onSubmit={onSubmitHandler}className='otp-form'>
          <h1 className='otp-title'>Email Verify OTP</h1>
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
        >verify Email</button>

        </form>
      
    </div>
  )
}

export default EmailVerify
