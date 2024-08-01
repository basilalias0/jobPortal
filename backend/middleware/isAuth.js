const jwt = require('jsonwebtoken')


const isAuth = ((req,res,next)=>{
    const token = req.cookies.userToken

    if(!token){
        throw new Error("Token not found")
    }else{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decoded){
            throw new Error("Token not verified")
        }else{
            req.user = decoded
            next()
        }
    }
})

module.exports = isAuth