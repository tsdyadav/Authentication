import jwt from "jsonwebtoken";


 const userAuth= async (req,res, next)=>{

    const {token}= req.cookies;
    console.log("Token:", token);

    if(!token){
        return res.json({
            success: false, message: "Not Authorized. Login again"
        });
    }

    try {

        // decode the token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
          console.log("DecodeToken:", tokenDecode);
           console.log("DecodeToken EIFF:", tokenDecode.id);
        //    req.userId= tokenDecode.id;
        //   console.log("USerid:", req.userId);
        if(tokenDecode.id){
            req.userId= tokenDecode.id;
            console.log("USerid:", req.userId);
        }
        else{
            return res.json({
            success: false,message: "Not Authorized. Login again!"
        });
        }

        next();


        
    } catch (error) {
          return res.json({
            success: false, message:error.message   // code problem
        });
        
    }
 }

 export default userAuth;






