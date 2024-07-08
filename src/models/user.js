const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const validator = require('validator')
const Tweet = require('../models/tweet')

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,

        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not in Email format')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (!(value.length >6)){
                throw new Error('Password cannot be of length less than 7')
            }
        }
    },
    googleId:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

},{
    timestamp:true
}
)

userSchema.virtual('tweets',{
    ref:'Tweet',
    localField:'_id',
    foreignField:'author'
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'secretToken')
    user.tokens= await user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.getPublicData= async function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('User not found')
    }
    if(!(await bcrypt.compare(password,user.password))){
        throw new Error('Wrong Password!')
    }
    return user
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User