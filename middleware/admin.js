const jwt=require("jsonwebtoken");
const {ADMIN_JWT_SECRET}=require("../config.js");
const { model } = require("mongoose");
const admin = require("../routes/admin.js");

function adminMiddleware(req,res,next){
    const token=req.headers.token;
    const decoded=jwt.verify(token,ADMIN_JWT_SECRET)
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
    adminMiddleware:adminMiddleware
}