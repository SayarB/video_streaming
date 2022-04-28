const express = require("express");
const app = express();
const fs = require("fs");
const movies = require("./moviePath").moviePath;
require("dotenv").config();
app.use(express.static("public"));
app.listen(8000, () => {
  console.log("");
});
app.get("/", (req, res) => {
  console.log(req.hostname);
  res.sendFile(__dirname + "/index.html");
});
app.get("/video", (req, res) => {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range Header");
  }
  const videoObj = movies.batman;
  const videoPath = videoObj.path;
  const format = videoObj.format;
  const subs = videoObj.subtitleFile;
  const videoSize = fs.statSync(videoPath).size;

  const chunk_size = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunk_size, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/" + format,
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});
