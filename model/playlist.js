const mongoose = require('mongoose');
const Schema = mongoose.Schema;

"use strict";

const PlaylistSchema = new Schema({
    name: { type: String, required: true, unique: true },
    creator: { type: String, required: true },
    description: { type: String, default: " " },
    number_tracks: { type: Number, required: true },
    tracks: [mongoose.ObjectId],
    playtime: { type: String, required: true },
    total_review_rating: { type: Number, required: true, default: 0 },
    total_review_time: { type: Number, required: true, default: 0 },
    review_rating: { type: Number, required: true, default: 0 },
    public: { type: Boolean, required: true },
    edit_date: { type: Date, default: Date.now, required: true }
},
{
    collection: 'playlist'
}
);

const Playlist = mongoose.model('PlaylistSchema', PlaylistSchema);
module.exports = Playlist;
