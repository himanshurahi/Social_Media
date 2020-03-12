const express = require("express");
const router = express.Router();
const validator = require("validator");
const { check, validationResult } = require("express-validator");
const helper = require('./helper')
const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get("/login", (req, res) =>  {
  res.send({ msg: "Got IT" });
});

router.post("/signup", [
    check('email').isEmail().withMessage('Invalid Email'),
    check('username').isAlpha().withMessage('Invalid Username'),
    check('password').isLength({min : 2}).withMessage('Password Length must be greater then 2')
], async (req, res)  => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
//     if (!req.body.username || !req.body.email || !req.body.password) {
//     return res.status(500).send({ error_msg: "Please Fill All Fields.." });
//   }

 const checkEmail = await User.findOne({email : req.body.email})
 if(checkEmail){
     return res.status(400).send({error_msg : 'Email Already Exists..'})
 }

 const checkUsername = await User.findOne({username : req.body.username})
 if(checkUsername){
    return res.status(400).send({error_msg : 'Username Already Exists..'})
 }

 const hashPassword = await bcrypt.hash(req.body.password, 10)

 const token = await jwt.sign({email : req.body.email, username : req.body.username}, 'himanshurahi') 

 const user = new User({
     username : req.body.username,
     email : req.body.email,
     password : hashPassword
 })

 try{
     await user.save()
     res.status(200).send({user, token})
 }
 catch(e){
     res.status(400).send(e)
 }

});


router.post('/login', async (req, res)  => {

    if(!req.body.username || !req.body.password){
        return res.status(404).send({error_msg : 'All Fields Required.'})
    }

    try {
        const user = await User.findOne({username : req.body.username})
        if(!user){
         return res.status(404).send({error_msg : 'No User Found'})
         }
        
        const isMatched = await bcrypt.compare(req.body.password, user.password)
         
        if(!isMatched){
            return res.status(404).send({error_msg : 'Wrong Username Or Password'})
        }

        const token =  jwt.sign({id : user._id,email : user.email, username : user.username}, 'himanshurahi') 
       
        const newUser = user.toObject()
        delete newUser.password
       
        res.status(200).send({user : newUser, token})

    } catch (error) {
        res.status(400).send(error)
    }



})

module.exports = router;
