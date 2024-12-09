const express = require("express");
const songsRouter = express.Router();

const {
  getSongs,
  postSong,
  getSongById,
} = require("../controllers/controllers");

const { handleMethodNotAllowed } = require("../controllers/errors");

songsRouter.route("/").get(getSongs).post(postSong).all(handleMethodNotAllowed);

songsRouter.get("/:id", getSongById);

module.exports = songsRouter;
