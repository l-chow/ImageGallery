import { log } from "console";

const express = require("express");
const fs = require("fs");

const app = express();

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.use(express.static(__dirname));

app.get("/images", (req, res) => {
  fs.readdir(__dirname + "/images", (err, files) => {
    let response = [];
    for (let i = 0; i < files.length; i++) {
      response.push({
        filename: files[i],
      });
    }
    res.status(200).json(response);
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
