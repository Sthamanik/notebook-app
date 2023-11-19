const express= require('express');
const User = require('../models/User');
const router= express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_secret = "let$ learn coding";

// ................................................ROUTE 1.......................................
// Create a User using: POST "/api/auth/createuser". Doesn't require login
router.post('/createuser',[
    body('name',"Enter a valid name").isLength({min: 3}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be at least 5 characters long").isLength({min: 5}),
], async (req,res)=>{
    let success = false;
    //if there is errors display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: result.array() });
    }
    //check whether there is user with same email
    try{
        
    let user= await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({success, errors: "email already exists" });
    }
    // securing the password 
    const salt= await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt);
    // creating users if not present 
        user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    })
    const data= {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_secret);
    success=true;
    res.json({success,authtoken})
    // res.json({status: "entered"})

    }catch(error){
        console.error(error.message);
        res.status(999).send("fatal error 404");
    }
})

// ................................................ROUTE 2.......................................
// authenticate a User using: POST "/api/auth/login". Doesn't require login
router.post('/login',[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password cannot be blank").exists()
], async (req,res)=>{
    let success= false;
    //if there is errors display them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: result.array() });
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success, error: "enter correct credentials"});
        }

        const passwordCompare= await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error: "enter correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_secret);
        success= true;
        res.json({success, authtoken})

    }catch( error ){
        console.error(error.message);
        res.status(999).send("internal server error !!!!");
    }
})

// ................................................ROUTE 3.......................................
// Get logged in  User details: POST "/api/auth/getuser". Require login
router.post('/getuser', fetchuser, async (req,res)=>{
try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(999).send("internal server error !!!!");   
}
})

module.exports = router
