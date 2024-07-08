const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth =require('../auth/auth')
const path=require('path')

