const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/user.js');

"use strict";
let router = express.Router();

//JWT secret, DO NOT EDIT
const SECRET = 'THISISECE9065GROUPPROJECTA_N_DTHISAPPISAWESOME!!!!';

// Send e-mail when user signup
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "wdtjx95@gmail.com",
        pass: "ifvuwmtiplnlvcoh"
    } 
 });

//Google API
const GOOGLE_CLIENT_ID = '562162783163-ne8p8bem2hinu31e17o3j9a2lav5epbo.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

//Google auth
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/auth/google/callback"
},
    async function(accessToken, refreshToken, profile, cb) {
        try {
            console.log(profile);
            const user = await User.findOne({ username: profile.id });
            if (user){
                cb(null, user);
            } else {
                const username = profile.id;
                const email = profile.emails[0].value;
                const password = 'google_user';
                const isVerified = true;
                const user = new User({
                    username,
                    email,
                    password,
                    isVerified: isVerified
                });
                await user.save();
                cb(null, user);
            }
        } catch(error) {
            cb(error, null);
        };
    }
));

//validating input of user info
const userRegister = Joi.object({
    username: Joi.string().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ca'] } }),
    password: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});
const userLogin = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ca'] } }),
    password: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});

//user register
router.post('/register', async function(req, res){
    let { error, value } = userRegister.validate(req.body); 
    if (error){
        //invalid input
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const username = value.username;
        const email = value.email;
        const password = await bcrypt.hash(value.password, 10);
        try {
            const user = new User({
                username,
                email,
                password,
                emailToken: crypto.randomBytes(64).toString('hex')
            });
            await user.save();
            //sending varification email
            if (!(email == 'wdtjx95@gmail.com')){
                sendEmail(req.headers.host, user);
            }
            console.log('User created successfully!');
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            if (error.code === 11000){
                //duplicate username or email
                return res.status(409).send({error: error.message});
            }
            return res.json({success:false, error: error.message});
        };
    };
});

//email varification
router.get('/emailverify', async function(req, res){
    try {
        const token = req.query.token;
        const user = await User.findOne({ emailToken: token });
        if (!user || user == null || user == undefined || user == {} || user == []){
            return res.json({success:false, error:'User does not exist!'});
        };
        user.emailToken = null;
        user.isVerified = true;
        await user.save();
        res.redirect('http://localhost:4200');
    } catch(error) {
        console.log(error);
    };
});

//user login
router.post('/login', async function(req, res){
    let { error, value } = userLogin.validate(req.body);
    if (error){
        //invalid input
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const email = value.email;
        const password = value.password;
        const user = await User.findOne({ email: email });
        if (!user || user == null || user == undefined || user == {} || user == []){
            console.log('User does not exist!');
            return res.status(404).send({error: 'User does not exist!'});
        }
        //check if input password equals to hashed password
        if (await bcrypt.compare(password, user.password)){
            //check if email is varified
            if (!user.isVerified){
                console.log('Email needs to be varified! Varification email send again!');
                //send the varification email again
                sendEmail(req.headers.host, user);
                return res.status(401).send({error: 'Please verify your email!'});
            }
            console.log('Login Success!');
            const token = generateAccessToken(user);
            return res.json({success: true, token: token, user: user});
        } else {
            console.log('Password incorrect!');
            return res.status(401).send({error: 'Password incorrect!'});
        };
    };
});

//check input password
const passwordChange = Joi.object({
    newpassword: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});
//user password change
router.post('/password-change', authenticateToken, async function(req, res){
    let { error, value } = passwordChange.validate(req.body);
    if (error){
        //invalid input
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const newpassword = value.newpassword;
        try {
            const user = req.user;
            console.log(user);
            const _id = user.user._id;
            const password = await bcrypt.hash(newpassword, 10);
            await User.updateOne(
                { _id },
                {
                    $set: { password }
                }
            );
            console.log("Password update success!");
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//google auth
router.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    function(req, res) {
        const token = generateAccessToken(req.user);
        console.log('Google login success!');
        // Successful authentication, redirect home.
        res.send(token);
    });

//function that generate access token
function generateAccessToken(user) {
    return jwt.sign({user}, SECRET, { expiresIn: '2h' });
};

//check user login
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        console.log('No token!');
        return res.status(401).send({error: 'No token!'});
    }
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            console.log('With token but no access!');
            return res.status(403).send({error: 'Token expired or not valid!'});
        }
        req.user = user;
        next();
    });
};

//function that send email
function sendEmail(host, user) {
    let mailopt = {
        from: '"Verify your email" <dianamusictool@gmail.com>',
        to: user.email,
        subject: 'Thank you for using Diana Music Tool!',
        html: `Hello, ${user.username}
            <br>Thanks for using Diana Music Tool!</br>
            <br>Please click on the link below to verify your email.</br>
            <a href="http://${host}/user/emailverify?token=${user.emailToken}">Click here to verify</a>`
    };
    transporter.sendMail(mailopt, function(err, res){
        if (err){
            console.log(err);
        } else {
            console.log('Email send success!');
        }
    });
};

module.exports = router;
