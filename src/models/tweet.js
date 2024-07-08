const mongoose = require('mongoose')
const Comment=require('./comment')
const tweetSchema = new mongoose.Schema({
    content :{
        type : String,
        required : true
    },

    author : {
        type : String,
        ref : 'User'
    },
    comments:[{
        content:{
            type:String,
            ref:'Comment'
        },
        author : {
            type : String,
            ref : 'User'
        },
        time:{
            type:String
        }
    }]

},
    {timestamps : true}
)



// Convert the timestamp string to a Date object


// Create an Intl.DateTimeFormat object for Indian locale
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

// Format the date and time in Indian format


tweetSchema.methods.getPublicData= async function(){
    const tweet = this
    const tweetObject = tweet.toObject()

    const timestamp = new Date(tweet.createdAt);
    const indianDate = indianFormat.format(timestamp);

    delete tweetObject.updatedAt
    delete tweetObject.__v
    tweetObject.date=indianDate
    delete tweetObject.createdAt


    return tweetObject
}

const Tweet = mongoose.model('Tweet',tweetSchema)

module.exports = Tweet