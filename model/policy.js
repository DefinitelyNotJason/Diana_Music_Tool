const mongoose = require('mongoose');
const Schema = mongoose.Schema;

"use strict";

const PolicySchema = new Schema({
    content: { type: String, required: true },
    type: { type: String, required: true }
},
{
    collection: 'policy'
}
);

const Policy = mongoose.model('PolicySchema', PolicySchema);
module.exports = Policy;
