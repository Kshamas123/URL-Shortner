const mongoose=require('mongoose')
const dotenv=require("dotenv")

dotenv.config()
const MONGODB_URI=process.env.MONGODB_URI
const conn=async ()=>{
    try{
   await mongoose.connect(MONGODB_URI)
   console.log("database connected")
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports=conn