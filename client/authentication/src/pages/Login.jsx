import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import './Login.css'
import { data, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/Appcontext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login =() => {

const navigate= useNavigate()

const {backendUrl,setIsLoggedin, getUserData}=useContext(AppContent)

  const [state, setState]=useState('Sign Up')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  const onSubmitHandler =async (e)=>{

    try 
    {
      e.preventDefault();

      axios.defaults.withCredentials=true

      if(state==='Sign Up'){
       const {data}= await axios.post(backendUrl + '/api/auth/register',{name,email,password})

      //  console.log(data.success) is return true
       if(data.success)
       {
        setIsLoggedin(true)
         getUserData()
        navigate('/')
       }
       else{
        toast.error(data.message) /// chec-----------k
       }
      }
      else{
        const {data}= await axios.post(backendUrl + '/api/auth/login',{email,password});
        console.log(data.success)
       if(data.success)
       {
        setIsLoggedin(true)
         getUserData()   
        navigate('/')
       }
       else{
        toast.error(data.message)
       }
      }
      
    }
    
    catch (error) {
      toast.error(error.message) //--------
    }
   

  }

  return (
    <div className='login-container'>
      <img onClick= {()=>navigate('/')} src={assets.logo} alt="" className='login-logo' />
      <div className='login-box'>    {/*sjdhJKS onClick= {()=>navigate('/')}*/}
        <h2 className='login-heading'>{state=== 'Sign Up' ? 'Create account' : 'Login'}</h2>
        <p className='login-subtext'>{state=== 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={onSubmitHandler}>
          {state==='Sign Up'&&(<div className='login-input-wrapper'>
            <img src={assets.person_icon} alt="" />
            <input 
            onChange={e=>setName(e.target.value)} 
            value={name} 
            className='login-input' type="text" placeholder='Full Name' required />
          </div>)}

          
          <div className='login-input-wrapper'>
            <img src={assets.mail_icon} alt="" />
            <input
             onChange={e=>setEmail(e.target.value)} 
            value={email} 
            className='login-input' type="text"  placeholder='Email id' required />
          </div>
          <div className='login-input-wrapper'>
            <img src={assets.lock_icon} alt="" />
            <input
             onChange={e=>setPassword(e.target.value)} 
            value={password} 
            className='login-input' type="password"  placeholder='Password' required />
          </div>
          <p onClick={()=>navigate('/reset-password')} className='forgot-password'>Forget password</p>
          <button className='login-button'>{state}</button>
        </form>

        {state==='Sign Up' ? ( <p className='toggle-text'>Already have an account?{' '}
          <span onClick={()=>setState('Login')} 
           className='toggle-link'>&nbsp;&nbsp;Login here</span>
        </p>
        ) 
        : 
        (
        <p onClick={()=>setState('Sign Up')} 
        className='toggle-text'>Don't have account?{' '}
          <span className='toggle-link'>&nbsp;&nbsp;Sign Up</span>
        </p>)}
       
         
      </div>
    </div>
  )
}

export default Login
