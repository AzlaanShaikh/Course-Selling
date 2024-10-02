const express =require("express")

const { userRouter } = require("./routes/user.js");

const {courseRouter} =require("./routes/course.js")
const {adminRouter} =require("./routes/admin.js")
const mongoose=require("mongoose")

const app=express();
app.use(express.json());
console.log("Hello from index.js");

app.use("/api/v1/user",userRouter);

app.use("/api/v1/admin",adminRouter);

app.use("/api/v1/course",courseRouter);

const main=async()=>{
    await mongoose.connect("mongodb+srv://azlaan472:azlaan472@cluster0.0fbm8.mongodb.net/coursera-app?retryWrites=true&w=majority&appName=Cluster0");
    app.listen(3000);
    console.log("Listtening on port 3000");
    
}


main()