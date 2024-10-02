const {Router} =require("express")

const adminRouter=Router();
const {adminModel} =require("../models/db.js")
const {courseModel}=require("../models/db.js")

const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const zod=require("zod")
const {ADMIN_JWT_SECRET}=require("../config.js");
const {adminMiddleware} = require("../middleware/admin.js");


adminRouter.post("/signup",async(req,res)=>{
    const authSchema = zod.object({
        email: zod.string().email({ message: "It is not a valid Email" }).min(5, { message: "Minimum 5 characters for email" }), // Email validation
        password: zod.string().min(5, { message: "Minimum 5 characters for password" }), // Password validation
        firstName: zod.string().min(3, { message: "Minimum 3 characters for first name" }), // First name validation
        lastName: zod.string().min(3, { message: "Minimum 3 characters for last name" }), // Last name validation
    });

    console.log("I AM HERE");

    // Safely parse the request body
    const parseBody = authSchema.safeParse(req.body);

    // Check if the parsing was successful
    if (!parseBody.success) {
        console.log("Validation error:", parseBody.error);
        return res.status(400).json({
            message: "Incorrect data format",
            error: parseBody.error.errors, // Better to send detailed error messages
        });
    }

    
    const {email,password,firstName,lastName}=req.body;

    const hashedPassword=await bcrypt.hash(password,10);
    console.log(hashedPassword);
  try {
      
    await adminModel.create({
        email,
        password:hashedPassword,
        firstName,
        lastName
    })


  } catch (error) {
    return res.status(400).json({
        message: "You are already signup", // Provide a message indicating signup failure
    });
  }

    res.json({
        message:"signup Successfully"
    })
})

adminRouter.post("/signin",async(req,res)=>{
    const authSchema = zod.object({
        email: zod.string().email({ message: "It is not a valid Email" }).min(5, { message: "Minimum 5 characters for email" }), 
        password: zod.string().min(5, { message: "Minimum 5 characters for password" }), 
    });
    const parseBody = authSchema.safeParse(req.body);
    if(!parseBody){
        console.log("Validation error:", parseBody.error);
        return res.status(400).json({
            message: "Incorrect data format",
            error: parseBody.error.errors, // Better to send detailed error messages
        }); 
    }

    const {email,password}=req.body;

    const user=await adminModel.findOne({
        email
    })
    if(!user){
        res.status(404).json({
            message:"User not Found"
        })
    }
    const isPasswordCorrect=bcrypt.compare(user.password,password);
    if(isPasswordCorrect){
        console.log(ADMIN_JWT_SECRET);
        
        const token=jwt.sign({id:user._id},ADMIN_JWT_SECRET);
        res.status(200).json({
            token:token
        });
    }else {
        // If the password does not match, return a 403 error indicating invalid credentials
        res.status(403).json({
            message: "Invalid Credentials!", // Error message for failed password comparison
        });
    }
})

adminRouter.post("/course",adminMiddleware,async (req,res)=>{
    const adminId=req.userId;
    const{title,description,price,imageUrl}=req.body;

    const course=await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId:adminId
    })
   
    res.json({
        message:"Course Created",
        courseId:course._id
    })
})

adminRouter.put("/course",adminMiddleware,async (req,res)=>{
    const adminId=req.userId;
    const{title,description,price,imageUrl,courseId}=req.body;

    const course=await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title,
        description,
        price,
        imageUrl,
    })
    if (!course) {
        return res.status(404).json({
            message: "Course not found!", // Inform the client that the specified course does not exist
        });
    }
    res.json({
        message:"course updated",
        course:course
    })
})

adminRouter.get("/course/bulk",adminMiddleware,async (req,res)=>{     
    const adminId=req.userId;
   

    const course=await courseModel.find({
        creatorId:adminId,
    })
   
    res.json({
        message:"courses",
        course:course
    })
})


module.exports={
    adminRouter:adminRouter
}