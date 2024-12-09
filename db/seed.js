const db = require("./connection");
const format = require("pg-format");

async function seed({ genres, artists, songs, playlists }) {
  // DROP TABLES
  await db.query(`DROP TABLE IF EXISTS playlists_songs;`),
    await db.query(`DROP TABLE IF EXISTS songs;`),
    await Promise.all([
      db.query(`DROP TABLE IF EXISTS genres;`),
      db.query(`DROP TABLE IF EXISTS artists;`),
      db.query(`DROP TABLE IF EXISTS playlists;`),
    ]);

  // CREATE TABLES
  await Promise.all([
    db.query(`CREATE TABLE genres(
            genre_name VARCHAR(40) PRIMARY KEY NOT NULL,
            description TEXT
        );`),

    db.query(`CREATE TABLE artists(
            artist_id SERIAL PRIMARY KEY,
            artist_name VARCHAR(40) NOT NULL,
            rating INT
        );`),
    db.query(`CREATE TABLE playlists (
            playlist_id SERIAL PRIMARY KEY,
            playlist_name VARCHAR(100),
            is_public BOOLEAN
);`),
  ]);

  await db.query(`CREATE TABLE songs(
    song_id SERIAL PRIMARY KEY,
    song_title VARCHAR(40) NOT NULL,
    release_year INT,
    artist_id INT NOT NULL,
    FOREIGN KEY(artist_id) REFERENCES artists(artist_id),
    genre VARCHAR REFERENCES genres(genre_name)
);`);

  db.query(`CREATE TABLE playlists_songs (
  playlist_id INT REFERENCES playlists(playlist_id),
    song_id INT REFERENCES songs(song_id)
);`);

  await db.query(
    format(
      "INSERT INTO genres (genre_name, description) VALUES %L;",
      genres.map((g) => [g.genre_name, g.description])
    )
  );

  const { rows: insertedPlaylists } = await db.query(
    format(
      "INSERT INTO playlists (playlist_name, is_public) VALUES %L;",
      playlists.map((pl) => [pl.playlist_name, pl.is_public])
    )
  );
  console.log(playlists);

  const { rows: insertedArtists } = await db.query(
    format(
      "INSERT INTO artists (artist_name, rating) VALUES %L RETURNING *;",
      artists.map((a) => [a.artist_name, a.rating])
    )
  );

  const lookUp = insertedArtists.reduce((lookUp, artist) => {
    return { ...lookUp, [artist.artist_name]: artist.artist_id };
  }, {});

  const formattedSongs = songs.map(({ artist, ...rest }) => {
    return { ...rest, artist_id: lookUp[rest.artist_name] };
  });

  await db.query(
    format(
      "INSERT INTO songs (song_title, release_year, artist_id, genre) VALUES %L;",
      formattedSongs.map((s) => [s.title, s.release_year, s.artist_id, s.genre])
    )
  );

  await db.query(`INSERT INTO playlists_songs (playlist_id, song_id)
VALUES
(1, 1),
(1, 3),
(1, 6),
(1, 7),
(2, 1), 
(2, 2),
(2, 4),
(2, 5),
(2, 7);`);
}

module.exports = seed;
