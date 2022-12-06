const mongoose = require('mongoose');
const Schema = mongoose.Schema;

"use strict";

const ReviewSchema = new Schema({
    list_name: { type: String, required: true },
    creator: { type: String, required: true },
    rating: { type: Number, required: true },
    content: { type: String, required: true },
    create_date: { type: Date, default: Date.now, required: true },
    public: { type: Boolean, default: true, required: true }
},
{
    collection: 'review'
}
);

const Review = mongoose.model('ReviewSchema', ReviewSchema);
module.exports = Review;
