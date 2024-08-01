const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[3,"Name must be 3 character long"]
    },
    email:{
        type:String,
        unique:true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password must need"],

    },
    phoneNumber:{
        type:String,
        unique:true,
        trim:true
    },
    age:{
        type:Number,
    },
    dob:{
        type:Date
    },
    hobbies:[{
        type:String
    }],
    interests:[{
        type:String,
    }],
    smoking:{
        type:Boolean
    },
    drinking:{
        type:Boolean
    },
    highestQualification:{
        type:String
    },
    profilePic:{
        type:String
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId
    }],
    shortReels:[{
        type:mongoose.Schema.Types.ObjectId
    }],
    role:{
        type:String
    },
    companyName:{
        type:String
    },
    companyLocation:{
        type:String
    },
    jobTitle:{
        type:String
    },
    experienceLevel:{
        type:String
    },
    STR:{
        type:Boolean
    },
    LTR:{
        type:Boolean
    },
    interestInDating:{
        type:Boolean
    },
    designation:{
        type:String
    }
},{
    timestamps:true
})


module.exports = mongoose.model("User",userSchema)
