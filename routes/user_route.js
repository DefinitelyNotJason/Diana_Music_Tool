const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

"use strict";
let router = express.Router();

//JWT secret, DO NOT EDIT
const SECRET = 'THISISECE9065GROUPPROJECTA_N_DTHISAPPISAWESOME!!!!';

//Google API
const GOOGLE_CLIENT_ID = '562162783163-ne8p8bem2hinu31e17o3j9a2lav5epbo.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

//Google auth
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(profile);
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
        try {
            const res = await User.create({
                username,
                email,
                password
            });
            console.log('User created successfully:', res);
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
            return res.json({success:false, error:'User does not exist!'});
        }
        //check if input password equals to hashed password
        if (await bcrypt.compare(password, user.password)){
            console.log('ok了家人们,登陆成功了家人们');
            const token = jwt.sign({
                id: user._id, 
                username: user.username
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
    passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('Google success!');
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;
