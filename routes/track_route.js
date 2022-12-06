const express = require('express');
const Joi = require('joi');
const Track = require('../model/track.js');

"use strict";
let router = express.Router();

//check input for track searching
const nameCheck = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    artist: Joi.string().trim().min(1).max(30).regex(/[$\(\)<>]/, { invert: true }),
    album: Joi.string().trim().min(1).max(30).regex(/[$\(\)<>]/, { invert: true })
});
//search tracks
router.get('/search/:name/:artist/:album', async function(req, res){
    let { error, value } = nameCheck.validate(req.params);
    if (error){
        console.log(error.message);
        return res.status(400).send({error: error.message});
    } else {
        const name = value.name.replace(/\s+/g, '').toLowerCase();
        const artist = value.artist.replace(/\s+/g, '').toLowerCase();
        const album = value.album.replace(/\s+/g, '').toLowerCase();
        try{
            let tracks = [];
            if (artist == 'all'){
                tracks = await Track.find(
                    { $or:[{track_title: { "$regex": name, "$options": "i" }}, 
                        {artist_name: { "$regex": name, "$options": "i" }},
                        {track_genres: { "$regex": name, "$options": "i" }},
                        {album_title: { "$regex": name, "$options": "i" }}] }
                )
                .limit(200);
            } else if (album == 'all'){
                tracks = await Track.find(
                    { $and:[{track_title: { "$regex": name, "$options": "i" }}, 
                        {artist_name: { "$regex": artist, "$options": "i" }}] }
                )
                .limit(200);
            } else {
                tracks = await Track.find(
                    { $and:[{track_title: { "$regex": name, "$options": "i" }}, 
                        {artist_name: { "$regex": artist, "$options": "i" }},
                        {album_title: { "$regex": album, "$options": "i" }}] }
                )
                .limit(200);
            };
            return res.send(tracks);
        } catch(error){
            console.log(error.message);
            return res.json({success: false, error: error.message});
        };
    };
});

//get track from input id
router.get('/getbyid/:id', async function(req, res){
    try{
        const track = await Track.findOne({ _id: req.params.id });
        console.log(track);
        return res.send(track);
    } catch(error){
        console.log(error.message);
        return res.json({success: false, error: error.message});
    };
});

module.exports = router;
