const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const User = require('../model/user.js');
const passport = require('passport');
const { doesNotMatch } = require('assert');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
                const res = await user.save();
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
        return res.status(400).send({'Error':error.message});
    } else {
        const username = value.username;
        const email = value.email;
        const password = await bcrypt.hash(value.password, 10);
        const isVerified = false;
        try {
            const user = new User({
                username,
                email,
                password,
                emailToken: crypto.randomBytes(64).toString('hex'),
                isVerified
            });
            const res = await user.save();
            //sending varification email
            let mailopt = {
                from: '"Verify your email" <dianamusictool@gmail.com>',
                to: user.email,
                subject: 'Thank you for using Diana Music Tool!',
                html: `Hello, ${user.username}
                    <br>Thanks for using Diana Music Tool!</br>
                    <br>Please click on the link below to verify your email.</br>
                    <a href="http://${req.headers.host}/user/emailverify?token=${user.emailToken}">Click here to verify</a>`
            };
            transporter.sendMail(mailopt, function(err, res){
                if (err){
                    console.log(err);
                } else {
                    console.log('Email send success!');
                }
            });
            console.log('User created successfully!');
        } catch(error){
            console.log(error.message);
            if (error.code === 11000){
                //duplicate username or email
                return res.json({success:false, error:'Username or email already exists!'});
            }
            throw error;
        };
        return res.json({success:true});
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
        res.redirect('/?token='+token);
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
        return res.status(400).send({'Error':error.message});
    } else {
        const email = value.email;
        const password = value.password;
        const user = await User.findOne({ email }).lean();
        if (!user || user == null || user == undefined || user == {} || user == []){
            console.log('User does not exist!');
            return res.json({success:false, error:'User does not exist!'});
        }
        //check if input password equals to hashed password
        if (await bcrypt.compare(password, user.password)){
            //check if email is varified
            if (!user.isVerified){
                console.log('Email needs to be varified! Varification email send again!');
                //send the varification email again
                let mailopt = {
                    from: '"Verify your email" <dianamusictool@gmail.com>',
                    to: user.email,
                    subject: 'Thank you for using Diana Music Tool!',
                    html: `Hello, ${user.username}
                        <br>Thanks for using Diana Music Tool!</br>
                        <br>Please click on the link below to verify your email.</br>
                        <a href="http://${req.headers.host}/user/emailverify?token=${user.emailToken}">Click here to verify</a>`
                };
                transporter.sendMail(mailopt, function(err, res){
                    if (err){
                        console.log(err);
                    } else {
                        console.log('Email send success!');
                    }
                });
            }
            console.log('ok了家人们,登陆成功了家人们');
            const token = jwt.sign({
                id: user._id, 
                username: user.username,
                email: user.email,
                isVerified: user.isVerified
            }, SECRET);
            console.log(token);
            return res.json({success:true, data:token});
        } else {
            console.log('Password incorrect!');
            return res.status(401).send({'Error':'Password incorrect!'});
        };
    };
});

//google auth
router.get('/auth/google',
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    function(req, res) {
        const token = jwt.sign({
            id: req.user._id, 
            username: req.user.username,
            email: req.user.email,
            isVerified: req.user.isVerified
        }, SECRET);
        console.log('Google login success!');
        // Successful authentication, redirect home.
        res.redirect('/?token='+token);
    });

module.exports = router;
