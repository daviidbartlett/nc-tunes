const {
  fetchSongs,
  insertSong,
  fetchSongById,
  fetchSongsByPlaylistId,
  checkPlaylistExists,
} = require("../models/models");

exports.getSongs = (req, res, next) => {
  const { maxyear } = req.query;

  fetchSongs(maxyear)
    .then((songs) => {
      res.send({ songs });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postSong = (req, res, next) => {
  const song = req.body;
  insertSong(song)
    .then((song) => {
      res.status(201).send({ song });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSongById = (req, res, next) => {
  const { id } = req.params;

  fetchSongById(id)
    .then((song) => {
      res.send({ song });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSongsByPlaylistId = (req, res, next) => {
  const { id } = req.params;

  Promise.all([fetchSongsByPlaylistId(id), checkPlaylistExists(id)])
    .then(([songs]) => {
      res.status(200).send({ songs });
    })
    .catch(next);
};

exports.getArtists = function () {};
exports.postArtist = function () {};
exports.getArtistById = function () {};
exports.patchArtist = function () {};
exports.deleteArtist = function () {};
