const mongoose = require('mongoose');
const Schema = mongoose.Schema;

"use strict";

const TrackSchema = new Schema({
    track_id: { type: String },
    album_id: { type: String },
    album_title: { type: String },
    artist_id: { type: String },
    artist_name: { type: String },
    artist_website: { type: String },
    track_date_created: { type: String },
    track_date_recorded: { type: String },
    track_disc_number: { type: String },
    track_duration: { type: String },
    track_genres: { type: String },
    track_number: { type: String },
    track_title: { type: String }
},
{
    collection: 'tracks'
}
);

const Track = mongoose.model('TrackSchema', TrackSchema);
module.exports = Track;
