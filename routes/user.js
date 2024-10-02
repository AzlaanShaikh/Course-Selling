const {Router} =require("express")
const zod=require("zod")
const userRouter =Router();
const bcrypt=require("bcrypt")
const {userModel} =require("../models/db.js")
const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require("../config.js");


userRouter.post("/signup", async function (req,res){
    console.log("HELLO");
    console.log(req.body);
    
    // Define the validation schema
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
      
    await userModel.create({
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
} )

userRouter.post("/signin",async function (req,res){
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

    const user=await userModel.findOne({
        email
    })
    if(!user){
        res.status(404).json({
            message:"User not Found"
        })
    }
    const isPasswordCorrect=bcrypt.compare(user.password,password);
    if(isPasswordCorrect){
        console.log(JWT_SECRET);
        
        const token=jwt.sign({id:user._id},JWT_SECRET);
        res.status(200).json({
            token:token
        });
    }else {
        // If the password does not match, return a 403 error indicating invalid credentials
        res.status(403).json({
            message: "Invalid Credentials!", // Error message for failed password comparison
        });
    }

}
)

userRouter.get("/purchase",(req,res)=>{

    res.json({
        message:"purchase endpoint"
    })
})

module.exports={
    userRouter:userRouter
}