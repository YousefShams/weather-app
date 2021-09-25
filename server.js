
// Setup empty JS object to act as endpoint for all routes
let projectData={};
const port=8000;
// Express to run server and routes
const express= require("express");

// Start up an instance of app
const app=express();



/* Middleware*/
const bodyParser= require("body-parser");
const cors= require("cors");


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Spin up the server
// Callback to debug
const server=app.listen(port, ()=> {
    console.log(`Server Started!!\nPort: ${port}`)
});


// Initialize all route with a callback function
app.get("/all", function(req,res){
    console.log("GET:");
    res.send(projectData);
    console.log(projectData);
});



// Post Route
app.post("/all", function(req,res){
console.log("POST:");
projectData= {
    temps : req.body.tempreture,
    cityname: req.body.cityName,
    feels: req.body.feelingsStr,
    Date: req.body.date,
};
res.send(projectData);
console.log(req.body);
});