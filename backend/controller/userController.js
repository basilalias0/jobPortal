const asyncHandler = require('express-async-handler')
const { Error } = require('mongoose')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const transporter = require('../utils/nodemailer')
const otpGenerator = require('otp-generator')



const userController = {
    generate_otp:asyncHandler(async(req,res)=>{
        const {name,phoneNumber,email} = req.body
        this.otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false, });
        console.log(this.otp);
        await transporter.sendMail({
            from:{
                name:"JOB PORTAL",
                address:"jobportalbybasil@gmail.com"
            },
            to: "watchutube47@gmail.com", // list of receivers
            subject: `Hello ${name}, OTP for Job Portal`,
            html: `<b>Your One time Password for job-Portal is <h3>${this.otp}</h3></b>`, // html body
          });
         
          res.send("Done!!")
    }),
    createUser:asyncHandler(async(req,res)=>{
        const {name,email,phoneNumber,password} = req.body

        const userFound = await User.findOne({email})
        const userNumberFound = await User.findOne({phoneNumber})

        if(!name || !email || !phoneNumber || !password){
            throw new Error("Details Incomplete")
        }else if(userFound){
            throw new Error("User already exist!!")
        }else if(userNumberFound){
            throw new Error("Number already exist, Please login wth number!!")
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const createdUser = await User.create({
                name,
                email,
                phoneNumber,
                password:hashedPassword
            })
        
        if(createdUser){
            const payload ={
                email
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET_KEY)

            res.cookie('userToken',token,{
                maxAge:24*60*60*1000,
                sameSite:'none',
                httpOnly:true,
                secure:false
            })
            res.json({
                name,
                email:createdUser.email,
                phoneNumber,
                token,
                id:createdUser._id
            })
        }else{
            throw new Error("User Creation Failed, Try Again!!")
        }


    }),

    loginUser:asyncHandler(async(req,res)=>{
        const {emailOrNumber, password} = req.body
        if(!emailOrNumber || !password){
            throw new Error("Login data incomplete")
        }
        const userFound = await User.findOne({
            $or:[{email:emailOrNumber},{phoneNumber:emailOrNumber}]
        })
        if(!userFound){
            throw new Error("User not Found")
        }

        const comparePassword = bcrypt.compare(password,userFound.password)
        if(!comparePassword){
            throw new Error("Password invalid!!")
        }
        const payload ={
            email:userFound.email
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET_KEY)

        res.cookie('userToken',token,{
            maxAge:24*60*60*1000,
            sameSite:'none',
            httpOnly:true,
            secure:false
        })
        res.json({
            name:userFound.name,
            email:userFound.email,
            phoneNumber:userFound.phoneNumber,
            token,
            id:userFound._id
        })

    }),
    personalProfileUpdate:asyncHandler(async(req,res)=>{
        const {age,dob,smoke,drink,qualification,interests,hobbies} = req.body

        if(!age || !qualification || !interests || !hobbies || smoke==null, drink==null){
            throw new Error("Profile data incomplete!")
        }

        const userFound = await User.findOne({email:req.user.email})
        if(!userFound){
            throw new Error("User not found")
        }
        const updatedData = await User.findOneAndUpdate({email:userFound.email},
            {$set:{
                age,
                dob,
                smoking:smoke,
                drinking:drink,
                highestQualification:qualification,
            },
        $addToSet:{
            interests: { $each:interests },
            hobbies:{$each:hobbies}
        },
        },{
            new:true
        }
        )

        res.send(updatedData)

    }),
    additionalProfileUpdate:asyncHandler(async(req,res)=>{
        const updates=req.body
        const userFound = await User.findOne({email:req.user.email})
        if(!userFound){
            throw new Error("User not found!")
        }

        const updatedData = await User.findByIdAndUpdate(userFound._id,{
            $set:updates
        },{
            new:true
        })

        res.send(updatedData)


    })

}

module.exports = userController