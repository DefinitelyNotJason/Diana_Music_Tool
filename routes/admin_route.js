const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const Review = require('../model/review.js');
const Policy = require('../model/policy.js');

"use strict";
let router = express.Router();

//JWT secret, DO NOT EDIT
const SECRET = 'THISISECE9065GROUPPROJECTA_N_DTHISAPPISAWESOME!!!!';

//get all users
router.get('/getallusers', authenticateToken, async function(req, res){
    try {
        const users = await User.find({});
        console.log("Users get success!");
        return res.send(users);
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

//check input name
const emailCheck = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ca'] } })
});
//grant admin privilege
router.post('/grantadmin', authenticateToken, async function(req, res){
    let { error, value } = emailCheck.validate(req.body); 
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const email = value.email;
        try {
            const user = await User.findOne({ email: email });
            if (!user || user == null || user == undefined || user == {} || user == []){
                console.log('Target user does not exist!');
                return res.status(404).send({error: 'Target user does not exist!'});
            }
            user.isAdmin = true;
            await user.save();
            console.log("Grant admin privilege success!");
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//get all reviews for all playlists
router.get('/getallreview', authenticateToken, async function(req, res){
    try {
        const reviews = await Review.find({});
        console.log("Reviews get success!");
        return res.send(reviews);
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

//hidden review
router.post('/hiddenreview', authenticateToken, async function(req, res){
    const id = req.body.id;
    try {
        const review = await Review.findOne({ _id: id });
        if (!review || review == null || review == undefined || review == {} || review == []){
            console.log('Review does not exist!');
            return res.status(404).send({error: 'Review does not exist!'});
        }
        review.public = false;
        await review.save();
        console.log("Review hidden success!");
        return res.json({success: true});
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

//remove hidden review
router.post('/publicreview', authenticateToken, async function(req, res){
    const id = req.body.id;
    try {
        const review = await Review.findOne({ _id: id });
        if (!review || review == null || review == undefined || review == {} || review == []){
            console.log('Review does not exist!');
            return res.status(404).send({error: 'Review does not exist!'});
        }
        review.public = true;
        await review.save();
        console.log("Review public success!");
        return res.json({success: true});
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

//deactivate user
router.post('/deactivateuser', authenticateToken, async function(req, res){
    let { error, value } = emailCheck.validate(req.body); 
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const email = value.email;
        if (email == 'wdtjx95@gmail.com'){
            console.log('No one can edit this account!');
            return res.status(403).send({error: 'You are not allow to modify this account!'});
        }
        try {
            const user = await User.findOne({ email: email });
            if (!user || user == null || user == undefined || user == {} || user == []){
                console.log('Target user does not exist!');
                return res.status(404).send({error: 'Target user does not exist!'});
            }
            user.isActive = false;
            await user.save();
            console.log("Deactive user success!");
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//activate user
router.post('/activateuser', authenticateToken, async function(req, res){
    let { error, value } = emailCheck.validate(req.body); 
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const email = value.email;
        if (email == 'wdtjx95@gmail.com'){
            console.log('No one can edit this account!');
            return res.status(403).send({error: 'You are not allow to modify this account!'});
        }
        try {
            const user = await User.findOne({ email: email });
            if (!user || user == null || user == undefined || user == {} || user == []){
                console.log('Target user does not exist!');
                return res.status(404).send({error: 'Target user does not exist!'});
            }
            user.isActive = true;
            await user.save();
            console.log("Active user success!");
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check policy input
const policyCheck = Joi.object({
    content: Joi.string().min(1).max(5000).required(),
    type: Joi.string().min(1).max(10).required()
});
//create policy
router.post('/createpolicy', authenticateToken, async function(req, res){
    let { error, value } = policyCheck.validate(req.body); 
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const content = value.content;
        const type = value.type;
        try {
            const exist_policy = await Policy.findOne({ type: type });
            if (exist_policy){
                console.log("Policy already exists!");
                return res.status(400).send({error: "Policy already exists!"});
            };
            const policy = new Policy({
                content: content,
                type: type
            });
            await policy.save();
            console.log("Create policy success!");
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//get policy
router.get('/getpolicy', authenticateToken, async function(req, res){
    const type = req.params.type;
    try {
        const policy = await Policy.findOne({ type: type });
        console.log("Policy get success!");
        return res.send(policy);
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

//update policy
router.post('/updatepolicy', authenticateToken, async function(req, res){
    let { error, value } = policyCheck.validate(req.body); 
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const content = value.content;
        const type = value.type;
        try {
            const policy = await Policy.findOne({ type: type });
            policy.content = content;
            await policy.save();
            console.log("Update policy success!");
            return res.json({success: true});
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check if admin
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        console.log('No token!');
        return res.status(401).send({error: 'No token!'});
    }
    jwt.verify(token, SECRET, async (err, user) => {
        if (err) {
            console.log('With token but no access!');
            return res.status(403).send({error: 'Token expired or not valid!'});
        }
        const cur_user = user.user;
        try {
            const user = await User.findOne({ username: cur_user.username });
            if (!user || user == null || user == undefined || user == {} || user == []){
                console.log('Target user does not exist!');
                return res.status(404).send({error: 'Target user does not exist!'});
            }
            if (!user.isVerified){
                console.log('User email is not verified!');
                return res.status(403).send({error: 'User email is not verified!'});
            }
            if (!user.isActive){
                console.log('User is deactivated!');
                return res.status(403).send({error: 'Account is deactivated! Please contact web admin: wdtjx95@gmail.com.'});
            }
            if (!user.isAdmin){
                console.log('User is not admin!');
                return res.status(401).send({error: 'User is not admin!'});
            }
            req.user = user;
            next();
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    });
};

module.exports = router;
