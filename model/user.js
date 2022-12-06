const mongoose = require('mongoose');
const Schema = mongoose.Schema;

"use strict";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emailToken: { type: String },
    isVerified: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: true, required: true },
    isAdmin: { type:Boolean, default: false, required: true }
},
{
    collection: 'user'
}
);

const User = mongoose.model('UserSchema', UserSchema);
module.exports = User;
