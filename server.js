const express = require("express");
const ytdl = require("@distube/ytdl-core");

const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/download", async (req, res) => {

  try {

    const videoURL = req.query.url;
    const format = req.query.format;

    if (!videoURL) {
      return res.send("No URL");
    }

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

  } catch (err) {

    console.log(err);

    res.send("Server Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
