const express= require('express')
require('./db/mongoose')
const path = require('path');

const app=express();
const tweetRouter = require('./routes/tweet')
const userRouter = require('./routes/user')

app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});



app.use(tweetRouter)
app.use(userRouter)
module.exports=app;