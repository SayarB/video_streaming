const express = require('express');
const app=express();
const fs = require('fs');
const moviePath= {
    rayep1:"RayMovie/Episode1(Forget me not).mkv",
    rayep2:"RayMovie/Episode2(Bahrupia).mkv",
    rayep3:"./RayMovie/Episode3(Hungama hai kyon bar).mkv",
    rayep4:"./RayMovie/Episode4(Spotlight).mkv"
}

require("dotenv").config();
app.use(express.static("public"));
app.listen(3000, ()=>
{
    console.log("listening on port 3000");
})
app.get('/', (req,res)=>
{
    console.log(req.hostname)
    res.sendFile(__dirname+"/index.html");
})
app.get('/video', (req,res)=>
{
    const range = req.headers.range;
    if (!range){
        res.status(400).send("Requires Range Header");
    }
    
    const videoPath = moviePath.rayep4;
    const videoSize = fs.statSync(videoPath).size;

    const chunk_size= 10 ** 6;
    const start = Number (range.replace(/\D/g, ""));
    const end = Math.min(start+chunk_size, videoSize-1);

    const contentLength =  end-start+1;
    const headers={
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mkv",
    }

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {start,end});
    videoStream.pipe(res);
});

