import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import './Header.css';
import { AppContent } from '../context/Appcontext';




const Header = () => {

    const userData= useContext(AppContent)
  
  
  return (
    <div className='header-container'>
      <img src={assets.header_img} alt="" className='header-img'/>
      <h1 className='header-title'>Hey {userData ? userData.name :'Developer' }! <img className='header-hand' src={assets.hand_wave} alt=""/></h1>
      <h2 className='header-subtitle'>Welcome to our app</h2>
      <p className='header-description'>Let's start with a quick product tourad we will have you up and running in no time!</p>
      <button className='header-btn'>Get start </button>
    </div>
  )
}

export default Header
