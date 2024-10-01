const express =require("express")
const jwt=require("jsonwebtoken")
const mongoose =require("mogoose")

const app=express();

app.get("/user/signup",function (req,res){
    res.json({
        message:"signup endpoint"
    })
} )

app.post("/user/signin",function (req,res){
    res.json({
        message:"signin endpoint"
    })
}
)

app.get("/user/purchase",(req,res)=>{
    res.json({
        message:"purchase endpoint"
    })
})

app.get("/course/purchases",(req,res)=>{
    res.json({
        message:"purchases endpoint"
    })
})

app.get("/courses",(req,res)=>{
    res.json({
        message:"courses endpoint"
    })
})





app.listen(3000)