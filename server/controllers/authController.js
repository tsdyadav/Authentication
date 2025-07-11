// like resister login logout 
// we we create api end pont
 import bcrypt from 'bcryptjs';
//  import { JsonWebTokenError } from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
//const { sign, verify } = jwt;
import {PASSWORD_RESET_TEMPLATE,EMAIL_VERIFY_TEMPLATE} from '../config/emailTemplates.js'


export const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name|| !email|| !password)
    {
        return res.json({sucess:false, message:'Missing details'})
    }
    try {
        
        const existingUser= await userModel.findOne({email});
        if(existingUser){
             return res.json({sucess:false, message:'User already exists'});
        }

        const hashedPassword= await bcrypt.hash(password,10);
        const user= new userModel({name,email,password:hashedPassword});
        await user.save();

        // genrate the token
      //-----toString---->sign
        const token = jwt.toString({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none':'strict',
            maxAge: 7*24*3600*1000  //7 days in ms
        });
         // ---------sending welcome email-----------

        const mailOption = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to MERN Authentication',
            text:`Welcome to greatstack website. your account has been created with email id: ${email}`
        }
        // await transporter.sendMail(mailOption);
        try {
           await transporter.sendMail(mailOption);
             console.log("Email sent successfully");
        } catch (error) {
                 console.error("Failed to send email:", error);
                }


        //return res.json({successs:true});
        return res.json({success:true , message:"Rgister Successfull!!"});
    } catch (error) {
        res.json({sucess:false, message:error.message});
        
    }
}

// --------------------------------------for login---------
export const  login= async (req,res)=>{
    const { email , password}= req.body;
    if(!email||!password)
    {
        return res.json({
            success: false,
            message: "Email and password are required!"
        });

    }
    try {

        const user= await userModel.findOne({email});
        if(!user)
        {
            return res.json({
                success: false,
                message:"Invalid email"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }
        // now need to genrate one token
        // because email exist and password is also match;
        const token= jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token', token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
            maxAge:7*24*3600*1000
        });

        // login notification

        const mailOption = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: ' Thanks  for Login to MERN Authentication',
            text:`Welcome back to greatstack website. your account has been Login with email id: ${email} is successfully`
        }
        // await transporter.sendMail(mailOption);
        try {
           await transporter.sendMail(mailOption);
             console.log("Email sent successfully");
        } catch (error) {
                 console.error("Failed to send email:", error);
                }

        return res.json({success:true});
        
    } catch (error) {
        return res.json({
            success:false,
            message: error.message
        });
    }
}
//-------------------------------------------------------------------------------------------------------------

// logout controller funciton

export const logout=async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
    

        })
        return res.json({
            sucess:true,
            message:"Logout Success!"
        });
        
    } catch (error) {
        return res.json({success:false, message:error.message});
        
    }

}

//---------------------------- verify the email---------------------------------
export const sendVerifyOtp= async (req,res)=>{
    try {
        const {userId}=req.body;

        const user=await userModel.findById(userId);
        if(user.isAccountVerified)
        {
            return res.json({successs: false,message:"Account already verified"});
        }
        
    const otp= String(Math.floor( 100000+  Math.random()*900000));
    // console.log(otp); // true
    user.verifyOtp=otp;
    // console.log(user.verifyOtp);
    user.verifyOtpExpireAt=Date.now()+5*60*1000;
    await user.save();
    console.log(user);

    const mailOption={
            from:process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            // text:`Your otp is ${otp}. Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

    }
    await transporter.sendMail(mailOption);


    res.json({success:true,message:'Verification otp sent on email'});
    } catch (error) {
        res.json({success:false, message: error.message});
        
    }
}


//   -------------------verify otp email----------------------------------------------------------------

export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;
    if(!userId||!otp)
    {
        return res.json({sucess:false, messge:'Missing Details'});
    }
    try {
        const user=await userModel.findById(userId);

        if(!user)
        {
            return res.json({
                success:false, message:'User not found'
            });
        }
        //  console.log((user));// undifined
        //  console.log(typeof otp);
        //  console.log(typeof user.verifyOtp);

        if(!user.verifyOtp||user.verifyOtp!==otp)
        {
            return res.json({
                success:false, message:"Invalid hai otp"
            });
            
        }
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({
                success:false,message:'OTP EXPired'
            });
        }

        user.isAccountVerified=true;
        user.verifyOtp=' ';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({
            success:true, message:'Email verified successfully'
        });
        
    } catch (error) {
          return res.json({success:false, message: error.message});
    }
}


// --------------------------------------is user authenticated or not--------------------------------------
export const isAuthenticated= async (req,res)=>{
    try {


        res.json({success:true});
        
    } catch (error) {
       return res.json({success:false, message: error.message});
    }
}

//send reset otp

export const sendRestotp= async(req,res)=>{
    const {email}=req.body;
    if(!email)
    {
        return res.json({success: false, message:"email is required"});
    }

    try {

        const user =await userModel.findOne({email});
        if(!user)
        {
            return res.json({successs:false , message: "user not found"});
        }
        const otp= String(Math.floor(100000 + Math.random()*900000));

        user.resetOtp=otp;
        user.resetOtpExpireAt =Date.now() + 24*3600*1000
        await user.save();

         const mailOption = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Rest OTP',
            text:`Your OTP for restting your password is ${otp} use this OTP to proceed with restting your password `,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        // await transporter.sendMail(mailOption);
        try {
           await transporter.sendMail(mailOption);
             console.log("Email sent successfully");
        } catch (error) {
                 console.error("Failed to send email:", error);
                }


        //return res.json({successs:true});
        return res.json({success:true , message:"OTP send to your mail is Successfull!!"});
        
    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

// reset user password

export const resetPassword = async (req,res)=>{
    const {email,otp,newPassword}=req.body;
    if(!email|| !otp||!newPassword)
    {
        return res.json({sucess:false, message:'Email, OTP , and new password are required'});
    }
    try {
        const user =await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false, message:"user not found"});
        }
        if(user.resetOtp===""||user.resetOtp!==otp)
        {
           return res.json({success:false, message:"Invalid OTP"});
        }

        if(user.resetOtpExpireAt< Date.now())
        {
            return res.json({success:false, message:"otp is EXpired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password =hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();
        return res.json({success:true, message:"Password has been reset successfully!!"});
        
    } catch (error) {
        res.json({success:false, message: error.message});
        
    }
}