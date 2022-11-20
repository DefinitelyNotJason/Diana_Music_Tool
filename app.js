const express = require('express');
const Joi = require('joi');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/user.js');

"use strict";
const app = express();
const PORT = 3000;
app.use(bodyParser.json());

//connect to MongoDB
mongoose.connect('mongodb+srv://jasontan:lanlanlu1346790@lab4db.tm9ypoe.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>app.listen(PORT, ()=>{
        console.log('MongoDB connected!');
        console.log('Listening on port 3000...');
    }))
    .catch((err)=>console.log(err));

app.get('/', function(req, res){
    console.log("Hello World!");
});

const userInfo = Joi.object({
    username: Joi.string().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true }),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ca'] } }),
    password: Joi.string().trim().min(1).max(30).required().regex(/[$\(\)<>]/, { invert: true })
});

app.post('/user/register', async(req, res)=>{
    let { error, value } = userInfo.validate(req.body); 
    if (error){
        //info type not allowed
        console.log(error.message);
        return res.status(400).send({'Error':error.message});
    } else {
        const username = value.username;
        const email = value.email;
        const password = await bcrypt.hash(value.password, 10);
        try {
            const res = await User.create({
                username,
                email,
                password
            });
            console.log('User created successfully:', res);
        } catch(error){
            console.log(error.message);
            if (error.code === 11000){
                //duplicate username or email
                return res.json({success:false, error:'Username or email already exists!'});
            }
            throw error;
        };
        return res.json({success:true});
    };
});