import { log } from "console";

const express = require("express");
const fs = require("fs");

const app = express();

type Image = {
  id: number;
  filename: string;
  likes: number;
};

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

app.use(express.static(__dirname));

app.get("/images", (req, res) => {
  // fs.readdir(__dirname + "/images", (err, files) => {
  //   let response = [];
  //   for (let i = 0; i < files.length; i++) {
  //     response.push({
  //       filename: files[i],
  //     });
  //   }
  //   res.status(200).json(response);
  // });
  fs.readFile(__dirname + "/data/images.json", (err, data) => {
    let response = [];
    const imgarr: Image[] = JSON.parse(data);
    if (imgarr) {
      imgarr.forEach((img) => {
        response.push({
          id: img.id,
          filename: img.filename,
          likes: img.likes,
        });
      });
      res.status(200).json(response);
    } else {
      res.status(404).json({});
    }
  });
});

app.post("/images/like/:id", (req, res) => {
  let imgid = req.params.id;
  console.log("hi api");
  if (imgid) {
    fs.readFile(__dirname + "/data/images.json", (err, data) => {
      console.log("read file");
      let imgarr: Image[] = JSON.parse(data);
      let toReturn: Image;
      if (imgarr) {
        let newImgArr = imgarr.map((img) => {
          if (img.id == imgid) {
            toReturn = {
              id: img.id,
              filename: img.filename,
              likes: img.likes + 1,
            };
            return toReturn;
          } else {
            return img;
          }
        });
        console.log("writing file");
        fs.writeFile(
          __dirname + "/data/images.json",
          JSON.stringify(newImgArr),
          { flag: "w+" },
          (err) => {
            console.log(err);
          }
        );
        res.status(200).json({
          status: "success",
          data: toReturn,
        });
      }
    });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
