const db = require("../db/connection");

exports.fetchSongs = (maxyear) => {
  const values = [];
  let queryStr = `SELECT 
song_id,
song_title AS title,
artist_name AS artist,
release_year
FROM songs 
JOIN artists 
ON songs.artist_id=artists.artist_id`;

  if (maxyear !== undefined) {
    queryStr += ` WHERE release_year <= $1`;
    values.push(maxyear);
  }

  return db.query(queryStr, values).then(({ rows }) => {
    return rows;
  });
};

exports.insertSong = (song) => {
  const { song_title, release_year, artist_id, genre } = song;
  return db
    .query(
      "INSERT INTO songs (song_title, release_year, artist_id, genre) VALUES ($1, $2, $3, $4) RETURNING *;",
      [song_title, release_year, artist_id, genre]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchSongById = (id) => {
  return db
    .query(
      `
        SELECT 
            song_id,
            song_title AS title,
            artist_name AS artist,
            release_year,
            genre
        FROM songs 
        JOIN artists 
        ON songs.artist_id=artists.artist_id
        WHERE song_id=$1 ;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Song not found." });
      }
      return rows[0];
    });
};

exports.fetchSongsByPlaylistId = (id) => {
  return db
    .query(
      `SELECT songs.song_id, 
            song_title AS title, 
            release_year 
      FROM songs
      JOIN playlists_songs
      ON songs.song_id = playlists_songs.song_id
      WHERE playlists_songs.playlist_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkPlaylistExists = (id) => {
  return db
    .query(`SELECT * FROM playlists WHERE playlists.playlist_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Playlist not found." });
      }
    });
};
