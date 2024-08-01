const express = require('express')
const userRouter = express.Router()
const userController = require('../controller/userController') 
const isAuth = require('../middleware/isAuth')



userRouter.post('/register',userController.createUser)
userRouter.post('/login',userController.loginUser)
userRouter.put('/personalProfile',isAuth,userController.personalProfileUpdate)
userRouter.put('/additionalUpdate',isAuth,userController.additionalProfileUpdate)

module.exports = userRouter