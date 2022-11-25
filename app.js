const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const user_route = require('./routes/user_route.js');
const track_route = require('./routes/track_route.js');
const playlist_route = require('./routes/playlist_route.js');
const admin_route = require('./routes/admin_route.js');

"use strict";
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

//connect to MongoDB Atlas
mongoose.connect('mongodb+srv://jasontan:atEKKPPMzudbMNad@lab4db.tm9ypoe.mongodb.net/Lab4_DB?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>app.listen(PORT, ()=>{
        console.log('MongoDB connected!');
        console.log('Listening on port 3000...');
    }))
    .catch((err)=>console.log(err));

//user route
app.use('/user', user_route);

//track route
app.use('/track', track_route);

//playlist route
app.use('/playlist', playlist_route);

//admin route
app.use('/admin', admin_route)

app.get('/', function(req, res){
    let token = req.query.token;
    // if (token){
    //     console.log(token);
    // }
    console.log("Hello World!");
    res.send("hello world");
});
