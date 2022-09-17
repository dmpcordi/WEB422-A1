/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Daniel Cordi   Student ID: 159262195    Date: Fri. Sep. 16, 2022
* Cyclic Link: 
*
********************************************************************************/ 

// Setup
const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser'); // REMOVED
const dotenv = require('dotenv').config();
const cors = require("cors");
const mongoose = require('mongoose');
const MoviesDB = require("./modules/moviesDB.js");
const { debugPort } = require('process');

const app = express();
const db = new MoviesDB();
const HTTP_PORT = process.env.PORT || 8080;


// Add support for incoming JSON entities
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({extended:false})); // REMOVED
// app.use(bodyParser.json()); // REMOVED


/* -------------------------------------- REMOVED -------------------------
// Root Route -- Startup
app.get("/", function(req, res)
    {
        console.log("\nDEBUG LOG: --------------------------------------------- Root Route -- Startup"); // DEBUG LOG

        res.sendFile(path.join(__dirname, "/views/home.html"));    

    }

); // ------------------------------------------------ Root Route -- Startup
// -------------------------------------- REMOVED ------------------------- */


// Root Route -- Message
app.get('/', (req, res) => 
    {
        console.log("\nDEBUG LOG: ----------------------------------------------- Root Route -- Message"); // DEBUG LOG

        res.status(200).json({message: 'API Listening'});
            
        
    }

); // -------------------------------------------------- Root Route -- Message


// API Movies Route -- Add One
app.post('/api/movies', (req, res) => 
    {
        console.log("\nDEBUG LOG: -------------------------------------------- API Movies Route -- Add One"); // DEBUG LOG

        // res.json({message: "return /api/movies " + req.body}); // DEBUG LOG
        
        // res.json({message: "post /api/movies"}); // DEBUG LOG
        console.log("DEBUG LOG: post /api/movies ............................... res.body ==> " + req.body); // DEBUG LOG
        

        db.addNewMovie(req.body)
        .then((newMovie) =>
            {
                res.status(200).json(newMovie);
            }
        )
        .catch((err) =>
            {
                console.log(err);
                res.status(500).send("No data found");

            }
        );
        
        //console.log("DEBUG LOG: .......................................................... mReturn ==> " + mReturn); // DEBUG LOG
    }
    
); // -------------------------------------- API Movies Route -- Add One 


// API Movies Route -- Search For Title, Page, PerPage
// :page:perPage:title
app.get('/api/movies', (req, res) => 
    {
        console.log("\nDEBUG LOG: ------------------------------- API Movies Route -- Search For Title, Page, PerPage"); // DEBUG LOG

        let mPage = req.query.page; 
        let mPerPage = req.query.perPage;
        let mTitle = req.query.title;
        

        // res.json({message: "search for movie title"}); // DEBUG LOG
        // console.log("DEBUG LOG: get /api/movies/:page:perPage:title ............................... res.query ==> " + JSON.stringify(req.query)); // DEBUG LOG
        console.log("DEBUG LOG:+++++++++++++++++++++ mPage ==> " + mPage); // DEBUG LOG
        console.log("DEBUG LOG:+++++++++++++++++++++ mPerPage ==> " + mPerPage); // DEBUG LOG
        console.log("DEBUG LOG:+++++++++++++++++++++ mTitle ==> " + mTitle); // DEBUG LOG

        // console.log("DEBUG LOG: get /api/movies/:page:perPage:title ............................... res.query ==> " ); // DEBUG LOG

        db.getAllMovies(mPage, mPerPage, mTitle)
        .then((movieArr) => 
            {
                console.log("DEBUG LOG: ..................... successful call"); // DEBUG LOG
                movieArr = movieArr.map(value => value.toObject());
                res.status(200).json(movieArr);
                console.log("DEBUG LOG: ..................... movieArr == > " + movieArr); // DEBUG LOG

            }
        )
        .catch((err) => 
        {
            console.log(err);
            res.status(500).send("No data found");
        });
    }

); // -------------------------------------- API Movies Route -- Search For Title, Page, PerPage


// API Movies Route -- Search For ID
app.get('/api/movies/:id', (req, res) => 
    {
        console.log("\nDEBUG LOG: ------------------------------------- API Movies Route -- Search For ID"); // DEBUG LOG
        
        // res.json({message: req.params.id}); // DEBUG LOG
        console.log("DEBUG LOG: get /api/movies/:id...................... req.params.id ==> " + req.params.id); // DEBUG LOG


        db.getMovieById(req.params.id)
        .then((m) =>
            {   
                res.status(200).json(m);
                
            }
        )
        .catch((err) =>
            {
                console.log(err);
                res.status(500).send("No data found");

            }
        );

        //console.log("DEBUG LOG: "); // DEBUG LOG
    }

); // -------------------------------------- API Movies Route -- Search For ID 


// API Movies Route -- Edit One
app.put('/api/movies/:id', (req, res) => 
    {
        console.log("\nDEBUG LOG: ------------------------------------ API Movies Route -- Edit One"); // DEBUG LOG
        
        // res.json({message: req.params}); // DEBUG LOG
        console.log("DEBUG LOG: put /api/movies/:id...................... req.params.id ==> " + req.params.id); // DEBUG LOG
        //updateMovieById(data,Id);

        db.updateMovieById(req.body, req.params.id)
        .then(() =>
            {
                res.status(200).json({message: "Data has been Updated Successfully"});
            }
        )
        .catch((err) =>
            {
                console.log(err);
                res.status(500).send("Update Failed");

            }
        );
    }

); // -------------------------------------------- API Movies Route -- Edit One


// API Movies Route -- Delete
app.delete('/api/movies/:id', (req, res) => 
    {
        console.log("\nDEBUG LOG: ------------------------------------ API Movies Route -- Delete One"); // DEBUG LOG

        // res.json({message: req.params}); // DEBUG LOG
        console.log("DEBUG LOG: delete /api/movies/:id...................... req.params.id ==> " + req.params.id); // DEBUG LOG
        
        db.deleteMovieById(req.params.id)
        .then(() =>
            {   
                res.status(200).json({message: "Data Deleted Successfully"});
                
            }
        )
        .catch((err) =>
            {
                console.log(err);
                res.status(500).send("Data Not Deleted");

            }
        );

    }
    
); // ----------------------------------------- API Movies Route -- Delete One


// Resource Not Found
app.use((req, res) => 
    {
        console.log("\nDEBUG LOG: --------------------------------------- Resource Not Found"); // DEBUG LOG

        res.status(404).send('404 Page Not Found');
    }

); // ----------------------------------------------- Resource Not Found


// Ensure Connection to Database
db.initialize(process.env.MONGODB_CONN_STRING)
.then(() =>
    {
        //console.log("\nDEBUG LOG: ------------------------------------ Database Connection (then)"); // DEBUG LOG
        

        app.listen(HTTP_PORT, () => 
            {
                console.log(`server listening on: ${HTTP_PORT}`);
            }
        );
    }
)
.catch((err) => 
    {
        //console.log("\nDEBUG LOG: ------------------------------------- Database Connection (catch)"); // DEBUG LOG

        console.log(err);
        console.log("-----------------------------------------500 Server Encounted Error");
    }

); // ------------------------------------------------- Database Connection


// mongoose.connect("mongodb://Nidan:dataBank77661155224433@senecaweb.spjde.mongodb.net/sample_supplies?retryWrites=true&w=majority");

// const xx = mongoose.createConnection(
//     "mongodb+srv://Nidan:dataBank77661155224433@senecaweb.spjde.mongodb.net/web422?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     }
//   );


/* ------------ DEBUG --------------
app.listen(HTTP_PORT, () => 
    {
        console.log(`server listening on: ${HTTP_PORT}`);
    }
);
// ------------ DEBUG -------------- */






/* --------------------------- REMOVED ----------------------
// // Deliver the app's home page to browser clients
// app.get('/', (req, res) => 
//     {
//         res.sendFile(path.join(__dirname, '/index.html'));
//     }

// ); // -------------------------------------------------- Root Route


// // Get all
// app.get('/api/items', (req, res) => 
//     {
//         res.json(
//             { 
//                 message: 'fetch all items' 
//             }
//         );
//     }

// ); // -------------------------------------- API Items Route


// // Get one
// app.get('/api/items/:itemId', (req, res) => 
//     {
//         res.json(
//             { 
//                 message: `get user with identifier: ${req.params.id}` 
//             }
//         );
//     }

// ); // ---------------------------------------- API Items Route -- Get One


// // Add new
// // This route expects a JSON object in the body, e.g. { "firstName": "Peter",
// // "lastName": "McIntyre" }
// app.post('/api/items', (req, res) => 
//     {
//         // MUST return HTTP 201
//         res.status(201).json(
//             { 
//                 message: `added a new item: ${req.body.firstName}
//                     ${req.body.lastName}`
//             }
//         );
//     }
    
// ); // -------------------------------------- API Items Route -- Add One 


// // Edit existing
// // This route expects a JSON object in the body, e.g. { "id": 123,
// // "firstName": "Peter", "lastName": "McIntyre" }
// app.put('/api/items/:id', (req, res) => 
//     {
//         res.json(
//             {
//                 message: `updated item with identifier: ${req.params.id} to
//                     ${req.body.firstName} ${req.body.lastName}`,
//             }
//         );
//     }

// ); // ---------------------------------------------- API Items Route -- Edit One


// // Delete item
// app.delete('/api/items/:id', (req, res) => 
//     {
//         res.status(200).json({ message: `deleted user with identifier:
//         ${req.params.id}` });
//     }
    
// ); // ----------------------------------------- API Items Route -- Delete


// // Resource not found (this should be at the end)
// app.use((req, res) => 
//     {
//         res.status(404).send('Resource not found');
//     }

// ); // ----------------------------------------------- Resource Not Found


// // Tell the app to start listening for requests
// app.listen(HTTP_PORT, () => 
//     {
//         console.log('Ready to handle requests on port ' + HTTP_PORT);
//     }

// ); // ----------------------------------------------------- App Listen
// --------------------------- REMOVED ---------------------- */






/* -------------- OLD CODE --------------------
// var HTTP_PORT = process.env.PORT || 8080;
// var express = require("express");
// var app = express();

// app.get("/", (req, res) => 
//     {
//         res.send("Daniel Cordi -- 159262195");
//     }

// ); // Root Route

// app.listen(HTTP_PORT);
//-------------- OLD CODE -------------------- */
