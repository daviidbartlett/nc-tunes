const express = require("express");
const artistsRouter = express.Router();

const {
  getArtists,
  postArtist,
  getArtistById,
  patchArtist,
  deleteArtist,
} = require("../controllers/controllers");

artistsRouter.route("/").get(getArtists).post(postArtist);

artistsRouter
  .route("/:id")
  .get(getArtistById)
  .patch(patchArtist)
  .delete(deleteArtist);

module.exports = artistsRouter;
