const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Playlist = require('../model/playlist.js');
const Track = require('../model/track.js');
const Review = require('../model/review.js');
const User = require('../model/user.js');

"use strict";
let router = express.Router();

//JWT secret, DO NOT EDIT
const SECRET = 'THISISECE9065GROUPPROJECTA_N_DTHISAPPISAWESOME!!!!';

//get first 10 playlists
router.get('/getlist', async function(req, res){
    try{
        const lists = await Playlist.find({ public: true }).sort({ edit_date: -1 }).limit(10);
        return res.send(lists);
    } catch(error){
        console.log(error.message);
        return res.json({success:false, error:error.message});
    };
});

//get playlist by name
router.get('/searchlist/:name', async function(req, res){
    const name = req.params.name;
    try {
        const list = await Playlist.findOne({ name: name });
        return res.send(list);
    } catch(error){
        return res.json({success:false, error:error.message});
    };
});

//check input for list name
const nameCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    description: Joi.string().max(500).optional().allow(null)
});
//save playlist
router.post('/savelist', authenticateToken, async function(req, res){
    let { error, value } = nameCheck.validate(req.body);
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const name = value.name.replace(/^\s*|\s*$/g,"");
        const description = value.description;
        const creator = req.user.username;
        const tracks = [];
        try{
            const lists = await Playlist.find({ creator: creator });
            if (lists.length >= 20){
                return res.status(403).send({error: 'Already created 20 playlists!'});
            }
            const if_list = await Playlist.find({ name:name });
            if (if_list.length >= 1){
                return res.status(403).send({error: 'Playlist name already exists!'});
            }
            const playlist = new Playlist({
                name,
                creator,
                description,
                number_tracks: "0",
                tracks,
                playtime: "0",
                public: false
            });
            await playlist.save();
            console.log('Playlist created successfully!');
            return res.json({success: true});            
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//get user's playlists
router.get('/getallplaylists', authenticateToken, async function(req, res){
    const creator = req.user.username;
    try{
        const lists = await Playlist.find({ creator: creator }).sort({ edit_date: -1 });
        return res.send(lists);           
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

//check input for desc update
const updateCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    description: Joi.string().max(500).optional().allow(null),
    public: Joi.boolean().required()
});
//update playlist
router.post('/updateplaylist', authenticateToken, async function(req, res){
    let { error, value } = updateCheck.validate(req.body);
    if (error){
        return res.status(400).send({error: error.message});
    } else {
        const name = value.name;
        const description = value.description;
        const creator = req.user.username;
        const public = value.public;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.status(404).send({error: 'Playlist does not exist!'});
            };
            if (playlist.creator != creator){
                return res.status(403).send({error: 'No access to this playlist!'});
            }
            playlist.description = description;
            playlist.public = public;
            playlist.edit_date = Date.now();
            await playlist.save();
            console.log('Description update success!');
            return res.json({success: true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check input for list update
const listUpdateCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    list: Joi.array().required()
});
//update playlist
router.post('/updatelist', authenticateToken, async function(req, res){
    let { error, value } = listUpdateCheck.validate(req.body);
    if (error){
        return res.status(400).send({error: error.message});
    } else {
        const name = value.name;
        const list = value.list;
        const creator = req.user.username;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.status(404).send({error: 'Playlist does not exist!'});
            };
            if (playlist.creator != creator){
                return res.status(403).send({error: 'No access to this playlist!'});
            }
            //update total playtime
            let total_time = [];
            const tracks = await Track.find({ _id: { $in: list } });
            console.log(tracks);
            const number_tracks = tracks.length;
            let playtime = "0";
            if (tracks.length > 0){
                tracks.forEach((e) => {
                    total_time.push(e.track_duration);
                });
                let totalSeconds = total_time.map((v) => {
                    let ary = v.split(':');
                    return +parseInt(ary[0])*60+parseInt(ary[1]);
                }).reduce((p, c) => {
                    return p+c;
                });
                console.log(total_time);
                let date = new Date(0);
                date.setSeconds(totalSeconds);
                playtime = date.toISOString().substring(11, 19);
            }
            console.log(playtime);
            playlist.number_tracks = number_tracks;
            playlist.playtime = playtime;
            playlist.tracks = list;
            playlist.edit_date = Date.now();
            await playlist.save();
            console.log('List update success!');
            return res.json({success: true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check delete playlist name
const deleteCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});
//delete playlist
router.post('/deletelist', authenticateToken, async function(req, res){
    let { error, value } = deleteCheck.validate(req.body);
    if (error){
        return res.status(400).send({error: error.message});
    } else {
        const name = value.name;
        const creator = req.user.username;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.status(404).send({error: 'Playlist does not exist!'});
            };
            if (playlist.creator != creator){
                return res.status(403).send({error: 'No access to this playlist!'});
            }
            await Review.remove({ list_name: name });
            await playlist.remove();
            console.log('Playlist deleted success!');
            return res.json({success: true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check review input
const reviewCheck = Joi.object({
    list_name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    rating: Joi.number().min(1).max(5),
    content: Joi.string().trim().min(1).max(500).required().regex(/[$\(\)<>]/, { invert: true })
});
//add review
router.post('/addreview', authenticateToken, async function(req, res){
    let { error, value } = reviewCheck.validate(req.body);
    if (error){
        return res.status(400).send({error: error.message});
    } else {
        const list_name = value.list_name;
        const rating = value.rating;
        const content = value.content;
        const creator = req.user.username;
        try {
            const playlist = await Playlist.findOne({ name: list_name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.status(404).send({error: 'Playlist does not exist!'});
            };
            const review = new Review({
                list_name,
                rating,
                creator,
                content
            });
            await review.save();
            const trr = playlist.total_review_rating+rating;
            const trt = playlist.total_review_time+1;
            const rr = Math.floor(trr/trt);
            playlist.total_review_rating = trr;
            playlist.total_review_time = trt;
            playlist.review_rating = rr;
            await playlist.save();
            console.log('Review added success!');
            return res.json({success: true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check review input
const reviewNameCheck = Joi.object({
    list_name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});
//get review
router.get('/getreview/:list_name', async function(req, res){
    let { error, value } = reviewNameCheck.validate(req.params);
    if (error){
        return res.status(400).send({error: error.message});
    } else {
        const list_name = value.list_name;
        try {
            const reviews = await Review.find({ list_name: list_name, public: true }).sort({ create_date: -1 });
            console.log(reviews);
            return res.send(reviews);  
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//check user login
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
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
            if (!user.isVerified){
                console.log('User email is not verified!');
                return res.status(403).send({error: 'User email is not verified!'});
            }
            if (!user.isActive){
                console.log('User is deactivated!');
                return res.status(403).send({error: 'Account is deactivated! Please contact web admin: wdtjx95@gmail.com.'});
            }
            req.user = user;
            next();
        } catch (error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        }
    });
};

module.exports = router;
