const mongoose=require('mongoose')
const User = require('./user')
const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:{
       type:String,
       required:true,
       ref:'User' 
    },
    time:{
        type:String
    }
},
    
    {timestamps:true}
)

const indianFormat = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });

commentSchema.methods.getDate=async function(){
    const comment = this

    const timestamp = new Date(comment.createdAt);
    const indianDate = indianFormat.format(timestamp);  
    
    return indianDate
}

const Comment = mongoose.model('Comment',commentSchema)

module.exports = Comment