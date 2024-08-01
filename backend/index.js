const express = require('express')
const  mongoose = require('mongoose')
const userRouter = require('./routes/userRoute')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const DBConnectionString = process.env.MONGODB_CONNECTION_STRING




const mongodb = async() =>{
    try {
        await mongoose.connect(DBConnectionString)
    console.log("DB Connection Successful");
    } catch (error) {
        console.log(error);
    }  
}
mongodb()



app.use(cookieParser())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.use('/api/v1/user',userRouter)
app.use(errorHandler)


app.listen(5000,console.log("Running Successfully on http://localhost:5000"))