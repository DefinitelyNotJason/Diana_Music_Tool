const mongoose = require('mongoose');
const Schema = mongoose.Schema;

"use strict";

const PlaylistSchema = new Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: String, required: true },
    number_tracks: { type: Number, required: true },
    tracks: [String],
    playtime: { type: String, required: true },
    total_review_score: { type: Number },
    total_review_time: { type: Number },
    review_score: { type: Number }
},
{
    collection: 'playlist'
}
);

const Playlist = mongoose.model('PlaylistSchema', PlaylistSchema);
module.exports = Playlist;
