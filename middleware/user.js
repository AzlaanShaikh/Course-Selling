const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config.js")

function userMiddleware(req,res,next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,JWT_SECRET)
    if(decoded){
        req.userId=decoded.id;
        next()
    }else{
        res.status(403).json({
            message:"You are not signedin"
        })
    }
}

module.exports={
    userMiddleware:userMiddleware
}