const express = require("express");
const path = require("path");
const ytdl = require("ytdl-core");

const app = express();

app.use(express.static(__dirname));

app.get("/download", async (req, res) => {

  const videoURL = req.query.url;
  const format = req.query.format;

  if (!ytdl.validateURL(videoURL)) {
    return res.send("Invalid URL");
  }

  const info = await ytdl.getInfo(videoURL);

  const title =
    info.videoDetails.title.replace(/[^\w\s]/gi, "");

  if (format === "mp3") {

    res.header(
      "Content-Disposition",
      `attachment; filename="${title}.mp3"`
    );

    ytdl(videoURL, {
      filter: "audioonly"
    }).pipe(res);

  } else {

    res.header(
      "Content-Disposition",
      `attachment; filename="${title}.mp4"`
    );

    ytdl(videoURL, {
      quality: "highest"
    }).pipe(res);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
