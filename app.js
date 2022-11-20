const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user_admin = require('./routes/user_route.js');

"use strict";
const app = express();
const PORT = 3000;
app.use(bodyParser.json());

//connect to MongoDB Atlas
mongoose.connect('mongodb+srv://jasontan:AfYbKb2nuLTdSGsa@lab4db.tm9ypoe.mongodb.net/Lab4_DB?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>app.listen(PORT, ()=>{
        console.log('MongoDB connected!');
        console.log('Listening on port 3000...');
    }))
    .catch((err)=>console.log(err));

//user router
app.use('/user', user_admin);

app.get('/', function(req, res){
    console.log("Hello World!");
});
