const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Playlist = require('../model/playlist.js');
const Track = require('../model/track.js');

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

//check input for list name
const nameCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    description: Joi.string()
});
//save playlist
router.post('/savelist', authenticateToken, async function(req, res){
    let { error, value } = nameCheck.validate(req.body);
    if (error){
        return res.status(400).send({'Error':'Invalid playlist name!'});
    } else {
        const lists = await Playlist.find({ creator: req.user.user.username });
        if (lists.length >= 20){
            return res.status(400).send({'Error':'Already created 20 playlists!'});
        }
        const name = value.name.replace(/^\s*|\s*$/g,"");
        const description = value.description;
        const creator = req.user.user.username;
        const tracks = [];
        try{
            const playlist = new Playlist({
                name,
                creator,
                description,
                number_tracks: "0",
                tracks,
                playtime: "0",
                total_review_score: 0,
                total_review_time: 0,
                review_score: 0,
                public: false
            });
            await playlist.save();
            console.log('Playlist created successfully!');
            return res.json({success:true});            
        } catch(error){
            console.log(error.message);
            return res.json({success:false, error:error.message});
        };
    };
});

//get user's playlists
router.get('/getallplaylists', authenticateToken, async function(req, res){
    const creator = req.user.user.username;
    try{
        const lists = await Playlist.find({ creator: creator }).sort({ edit_date: -1 });
        return res.send(lists);           
    } catch(error){
        console.log(error.message);
        return res.json({success:false, error:error.message});
    };
});

//check input for desc update
const updateCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    description: Joi.string().optional().allow(null),
    public: Joi.boolean().required()
});
//update playlist
router.post('/updateplaylist', authenticateToken, async function(req, res){
    let { error, value } = updateCheck.validate(req.body);
    if (error){
        return res.status(400).send({'Error':'Invalid input!'});
    } else {
        const name = value.name;
        const description = value.description;
        const creator = req.user.user.username;
        const public = value.public;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.json({success:false, error:'Playlist does not exist!'});
            };
            if (playlist.creator != creator){
                return res.status(403).send({'Error':'No access to this playlist!'});
            }
            playlist.description = description;
            playlist.public = public;
            playlist.edit_date = Date.now();
            await playlist.save();
            console.log('Description update success!');
            return res.json({success:true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success:false, error:error.message});
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
        return res.status(400).send({'Error':'Invalid input!'});
    } else {
        const name = value.name;
        const list = value.list;
        // //实验
        // const tracks = await Track.find().limit(2);
        // const list = [];
        // tracks.forEach((e)=>{
        //     list.push(e._id);
        // });
        // console.log(list);

        const creator = req.user.user.username;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.json({success:false, error:'Playlist does not exist!'});
            };
            if (playlist.creator != creator){
                return res.status(403).send({'Error':'No access to this playlist!'});
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
            return res.json({success:true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success:false, error:error.message});
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
        return res.status(400).send({'Error':'Invalid input!'});
    } else {
        const name = value.name;
        const creator = req.user.user.username;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.json({success:false, error:'Playlist does not exist!'});
            };
            if (playlist.creator != creator){
                return res.status(403).send({'Error':'No access to this playlist!'});
            }
            await playlist.remove();
            console.log('Playlist deleted success!');
            return res.json({success:true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success:false, error:error.message});
        };
    };
});

//check review input
const reviewCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    review: Joi.string().trim().min(1).max(500).required().regex(/[$\(\)<>]/, { invert: true }),
    score: Joi.number().integer().min(1).max(5).required()
});
//add review
router.post('/addreview', authenticateToken, async function(req, res){
    let { error, value } = reviewCheck.validate(req.body);
    if (error){
        return res.status(400).send({'Error':'Invalid input!'});
    } else {
        const name = value.name;
        const review = value.review;
        const score = value.score;
        try {
            const playlist = await Playlist.findOne({ name: name });
            if (!playlist || playlist == null || playlist == undefined || playlist == {} || playlist == []){
                return res.json({success:false, error:'Playlist does not exist!'});
            };
            console.log(playlist);
            const new_total_score = playlist.total_review_score + score;
            const new_total_time = playlist.total_review_time + 1;
            const new_score = new_total_score/new_total_time;
            let new_list = playlist.review_list;
            new_list.push(review);
            playlist.total_review_score = new_total_score;
            playlist.total_review_time = new_total_time;
            playlist.review_score = new_score;
            playlist.review_list = new_list;
            await playlist.save();
            console.log('Review added success!');
            return res.json({success:true}); 
        } catch(error){
            console.log(error.message);
            return res.json({success:false, error:error.message});
        };
    };
});

//check user login
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null){
        console.log('No token!');
        return res.sendStatus(401);
    }
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            console.log('With token but no access!');
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = router;
