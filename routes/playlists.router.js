const playlistsRouter = require("express").Router();
const { getSongsByPlaylistId } = require("../controllers/controllers");

playlistsRouter.get("/:id/songs", getSongsByPlaylistId);

module.exports = playlistsRouter;
