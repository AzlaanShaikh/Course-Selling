const {Router} =require("express")

const courseRouter =Router();


courseRouter.get("/purchases",(req,res)=>{
    res.json({
        message:"purchases endpoint"
    })
})

courseRouter.get("/preview",(req,res)=>{
    res.json({
        message:"courses endpoint"
    })
})

module.exports={
    courseRouter:courseRouter
}