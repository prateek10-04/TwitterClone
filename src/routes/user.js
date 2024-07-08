const express = require('express')
const User = require('../models/user')
const Tweet = require('../models/tweet')
const router = new express.Router()
const auth = require('../auth/auth')
require('dotenv').config()
const session=require('express-session')
const MongoStore = require('connect-mongo')
var userProfile=null
var token1=null
var error1=null

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(200).send({ user: await user.getPublicData(), token: token });
    } catch (error) {
        console.log(error)
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Check if the error is a duplicate key error
            if (error.keyPattern.userName) {
                res.status(400).send({ message: 'This username is already taken' });
            } else if (error.keyPattern.email) {
                res.status(400).send({ message: 'Account already present with this email ID' });
            } else {
                res.status(500).send({ message: 'Unexpected duplicate key error' });
            }
        } else if(error.errors.password){
            // Handle other errors
            res.status(500).send({ message: 'Password cannot be of length less than 7' });
        }
    }
});



router.post('/users/login',async (req,res)=>{
    try{

    const user= await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({message:'Logged in successfully',user:await user.getPublicData(),token:token})
    
    }
    catch(error){
        res.status(400).send({message:error.message})
    }
})

router.post('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).send('Logged out successfully!')
    }catch(error){
        res.status(500).send(error.message)
    }
})

router.delete('/users/me',auth,async (req,res)=>{   
    try {
        const user = req.user; 
        const result = await User.deleteOne({ _id: user._id });

        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }
        await Tweet.deleteMany({author:req.user.userName})
        res.status(200).send('User Deleted successfully')
    }
    catch(error){
        res.status(500).send()
    }
    
})

router.get('/users/me',auth,async (req,res)=>{
    try{
        res.status(200).send({user: await req.user.getPublicData(),token:req.token})
    }catch(error){
        res.status(500).send(error.message)
    }
})

const passport=require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    userProfile=profile
    done(null,profile)
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

router.use(express.json())
//router.use(express.static(path.join(__dirname,'client')))

function isLoggedin(req,res,next){
    req.user?next():res.status(401).send('Unauthorized')
}

// router.get('/',(req,res)=>{
//     res.sendFile('index.html')
// })

router.use(
    session({
      secret: 'mysecret',
      resave: false,
      saveUninitialized: true,
      store:  MongoStore.create({ mongoUrl: 'mongodb+srv://taskapp:Prateek10@cluster0.ssftsf9.mongodb.net/twitter_clone?retryWrites=true' }),
      cookie: { secure: true },
    })
  );

router.use(passport.initialize())
router.use(passport.session())

router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/index.html'
    }),
    async (req, res) => {
        try {
            // User object from Google authentication

           // Check if the user already exists in the database
            const existingUser = await User.findOne({ googleId: req.user.id});

            const user = existingUser || new User({
                userName: req.user.displayName,
                email: req.user.email,
                // You may need to adjust this based on the actual structure of the user object
                // returned by Google authentication
                googleId: req.user.id,
                password: 'DefaultPassword'
            });
            
            // Save the user (if it's a new user)
            if (!existingUser) {
                await user.save();
            }

            // Generate JWT token and send the response
            token1 = await user.generateAuthToken();
            console.log(token1)
            res.redirect('/dashboard.html')
        } catch (error) {
            error1=error
            res.redirect('/index.html')
        }
    }
);


router.get('/success',(req,res)=>{
    res.send({token1})
})

router.get('/failed',(req,res)=>{
    
    if (error1.name === 'MongoServerError' && error1.code === 11000) {
        // Check if the error is a duplicate key error
        if (error1.keyPattern.userName) {
            res.send({ message: 'This username is already taken' });
        } else if (error1.keyPattern.email) {
            res.send({ message: 'Account already present with this email ID' });
        } else {
            res.send({ message: 'Unexpected duplicate key error' });
        }
    }error1=null
})

// router.use('/auth/logout',(req,res)=>{
//     req.session.destroy()
//     res.send('Looged out')
// })


// Inside your server file (e.g., app.js or server.js)







module.exports = router