'use strict'
// index.js ffirst change
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", async function(request, response) {
  let prefTab = await dumpPref();
  if (prefTab.length >= 15) {
    response.sendFile(__dirname + "/public/winner.html");
  } else {
    response.sendFile(__dirname + "/public/compare.html");
  }

});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());
let repeats = { "8+8": 1 }
app.get("/getTwoVideos", async function(req, res) {
  let random1 = 8;
  let random2 = 8;
  let isRepeat = true;
  let videoArray = await dumpTable();
  let video1 = videoArray[random1];
  let video2 = videoArray[random2];

  while (random1 == random2 || isRepeat) {
    random1 = getRandomInt(7); //assuming 0-7 vids
    random2 = getRandomInt(7);
    video1 = videoArray[random1];
    video2 = videoArray[random2];
    isRepeat = checkIfRepeat(video1.rowIdNum,video2.rowIdNum);
    console.log("Random generated: ", video1.rowIdNum,video2.rowIdNum)
  }


  // console.log("Line 57: ", videoArray)
  // console.log("Line 59: ", videoArray[1])
  
  console.log("Choosen video: ", video1.rowIdNum, video2.rowIdNum)
  console.log([video1, video2])
  res.send([video1, video2]);

});

function checkIfRepeat(num1, num2) {
  let string1 = num1 + "+" + num2;
  let string2 = num2 + "+" + num1;
  let hasKey1 = string1 in repeats;
  let hasKey2 = string2 in repeats;
  if (hasKey1 || hasKey2) {
    return true;
  } else {
    return false;
  }
}

app.post('/insertPref', async function(req, res, next) {
  // console.log("Post body:", req.body);
  let betterWorse = req.body;
  let num1 = betterWorse.better;
  let num2 = betterWorse.worse;
  console.log("Rowid of videos: ", num1,num2)
  addToDict(num1, num2);
  console.log("Repeat dictonary is: ", repeats)
  // console.log(betterWorse)
  await insertVideo(betterWorse)
  let prefTab = await dumpPref();
  // console.log(prefTab, "Length is: ", prefTab.length);
  if (prefTab.length >= 15) {
    res.send("pick winner")
  } else {
    res.send("reload")
  }



});

function addToDict(num1, num2) {
  let string1 = num1 + "+" + num2;
  let string2 = num2 + "+" + num1;
  repeats[string1] = 1;
  repeats[string2] = 1;
}

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // change parameter to "true" to get it to computer real winner based on PrefTable 
    // with parameter="false", it uses fake preferences data and gets a random result.
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8, false);
    // console.log("winner var is : ", winner)
    let winnerVid = await getwinvid(winner);
    // console.log("Winner vid is: ", winnerVid)
    res.json(winnerVid);
    // you'll need to send back a more meaningful response here.
  } catch (err) {
    res.status(500).send(err);
  }
});


// Page not found
app.use(function(req, res) {
  res.status(404);
  res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification
async function dumpTable() {
  const sql = "select * from VideoTable"

  let result = await db.all(sql)
  // console.log("line 94: ", result)
  return result;
}
async function dumpPref() {
  const sql = "select * from PrefTable"

  let result = await db.all(sql)
  // console.log("line 94: ", result)
  return result;
}
async function insertVideo(v) {
  const sql = "insert into PrefTable (better,worse) values (?,?)";
  // console.log("video was inserted");
  await db.run(sql, [v.better, v.worse]);
}

async function getwinvid(v) {
  const sql = "SELECT * FROM VideoTable WHERE rowIdNum= ?";
  // console.log("video was inserted");
  let result = await db.get(sql, [v]);
  return result;

}
// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});

