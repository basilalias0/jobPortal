const express = require('express')
const userRouter = express.Router()
const userController = require('../controller/userController') 
const isAuth = require('../middleware/isAuth')



userRouter.post('/register',userController.createUser)
userRouter.post('/login',userController.loginUser)
userRouter.put('/personalProfile',isAuth,userController.personalProfileUpdate)
userRouter.put('/additionalUpdate',isAuth,userController.additionalProfileUpdate)
userRouter.post('/otp-gen',userController.generate_otp)

module.exports = userRouter