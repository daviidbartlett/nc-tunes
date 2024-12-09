const express = require("express");
const apiRouter = express.Router();

const artistsRouter = require("./artists.router");
const songsRouter = require("./songs.router");
const playlistsRouter = require("./playlists.router");

apiRouter.use("/artists", artistsRouter);
apiRouter.use("/songs", songsRouter);
apiRouter.use("/playlists", playlistsRouter);

module.exports = apiRouter;
