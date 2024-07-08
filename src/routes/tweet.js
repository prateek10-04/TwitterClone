const express=require('express')
const Tweet = require('../models/tweet')
const router = new express.Router()
const User = require('../models/user')
const auth = require ('../auth/auth')
const path = require('path');
const Comment = require('../models/comment')



router.get('/tweets',async (req,res)=>{
    try{
         const tweets = await Tweet.find()
        
        const updatedTweets = await Promise.all(tweets.map(async (tweet) => {
            return await tweet.getPublicData()
        }))
        res.status(200).send(updatedTweets)
    }catch(error){
        res.status(500).send(error.message)
    }
})



router.get('/tweets/:tweetID',auth,async (req,res)=>{
    try{
        const tweet=await Tweet.findOne({_id:req.params.tweetID,author:req.user.userName})
        res.status(200).send(tweet)
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.post('/tweets/post',auth,async (req,res)=>{
    const user = await User.findOne({ _id: req.user._id })
    const tweet = new Tweet({
        ...req.body,
        author : user.userName
    })
    try{
        await tweet.save()
        res.status(201).send(await tweet.getPublicData())
    }
    catch(error){
        res.status(500).send(error)
    }
})

router.post('/tweets/comment/:tweetID',auth,async (req,res)=>{
    const id =req.params.tweetID
    const tweet = await Tweet.findOne({_id:id})
    try{
        const comment = new Comment({
            ...req.body,
            author : req.user.userName
        })
        await comment.save()
        tweet.comments.push({content:comment.content,author:comment.author,time:await comment.getDate(),_id:comment._id})
        await tweet.save()
        res.send({tweet})
    }
    catch(error){
        res.status(500).send(error.message)
    }
})

router.patch('/tweets/update/:tweetID',auth,async (req,res)=>{
    if((Object.keys(req.body))[0]!=='content'){
        return res.status(400).send('Cannot update this feature')
    }
    try{
        const tweet = await Tweet.findOne({author:req.user.userName,_id:req.params.tweetID})
        if(!tweet){
            return res.status(400).send('No tweet found with this ID.')
        }
        tweet.content=req.body.content
        await tweet.save()
        res.status(200).send({message:'Tweet updated successfully!',tweet:tweet.content})
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.patch('/tweets/comment/update/:tweetID/:commentID',auth,async(req,res)=>{
    if((Object.keys(req.body))[0]!=='content'){
        return res.status(400).send('Cannot update this feature')
    }
    try{
        const tweet = await Tweet.findById(req.params.tweetID)
        const comment = await Comment.findById(req.params.commentID)
        if(!tweet){
            return res.status(400).send('No tweet found with this ID.')
        }
        if(!comment){
            return res.status(400).send('No comment found with this ID.')
        }
        comment.content=req.body.content
        const commentIndex = tweet.comments.findIndex(comment => comment._id.toString() === req.params.commentID);
        if (commentIndex === -1) {
            console.log('Comment not found');
            return;
        }

        // Update the content of the comment
        tweet.comments[commentIndex].content = req.body.content;

        // Save the updated tweet document
        await tweet.save();
        await comment.save()
        res.status(200).send({message:'Tweet updated successfully!',tweet})
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.delete('/tweets/delete/:tweetID',auth,async (req,res)=>{
    try{
        console.log(req.user.userName)
        const tweet = await Tweet.findOneAndDelete({author:req.user.userName,_id:req.params.tweetID})
        if(!tweet){
            return res.status(400).send('No tweet found with this ID')
        }
        res.status(200).send('Tweet deleted successfully!')
    }
    catch(error){
        res.status(500).send(error.message)
    }
})

router.delete('/tweets/comment/delete/:tweetID/:commentID',auth,async (req,res)=>{
    const user = await User.findOne({_id:req.user._id})
    const tweet = await Tweet.findOne({_id:req.params.tweetID})
    const comment = await Comment.findById(req.params.commentID)
    if(comment===null){return res.status(400).send('Comment not fount')}

    if(!(comment.author === req.user.userName)){return res.status(401).send('Cannot delete someone else\'s comment')}
    try{
        
        await Tweet.updateOne({ _id: tweet._id }, { $pull: { comments: { _id: comment._id } } })
       // console.log(tweet)
        await Comment.findByIdAndDelete(comment._id)
        // await Comment.save()
         await tweet.save()
        res.send({msg:'Comment deleted'})
    }catch(error){
        res.status(500).send(error.message)
    }
})


module.exports = router