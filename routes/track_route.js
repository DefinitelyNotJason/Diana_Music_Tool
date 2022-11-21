const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Track = require('../model/track.js');
const Playlist = require('../model/playlist.js');

"use strict";
let router = express.Router();

//JWT secret, DO NOT EDIT
const SECRET = 'THISISECE9065GROUPPROJECTA_N_DTHISAPPISAWESOME!!!!';

//check input for track searching
const nameCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});

//search tracks
router.get('/search/:name', async function(req, res){
    let { error, value } = nameCheck.validate(req.params);
    if (error){
        return res.status(400).send({'Error':'Invalid input name!'});
    } else {
        const name = value.name.replace(/\s+/g, '').toLowerCase();
        try{
            const tracks = await Track.find(
                { $or:[{track_title: { "$regex": name, "$options": "i" }}, 
                    {artist_name: { "$regex": name, "$options": "i" }},
                    {track_genres: { "$regex": name, "$options": "i" }},
                    {album_title: { "$regex": name, "$options": "i" }}] }
            );
            console.log(tracks.length);
            console.log(tracks[0]);
            return res.send(tracks);
        } catch(error){
            throw error;
        };
    };
});

//save playlist
router.post('/savelist', async function(req, res){
    let { error, value } = nameCheck.validate(req.body);
    if (error){
        return res.status(400).send({'Error':'Invalid playlist name!'});
    } else {
        const name = value.name.replace(/^\s*|\s*$/g,"");
        const tracks = [];
        try{
            const playlist = new Playlist({
                name,
                creator: "Jason",
                number_tracks: "0",
                tracks,
                playtime: "0",
                total_review_score: 0,
                total_review_time: 0,
                review_score: 0
            });
            await playlist.save();
            console.log('Playlist created successfully!');
            return res.json({success:true});            
        } catch(error){
            console.log(error.message);
            if (error.code === 11000){
                //duplicate username or email
                return res.json({success:false, error:'Username or email already exists!'});
            }
            throw error;
        };
    };
});

//check if user login or not
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
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
