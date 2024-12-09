const request = require("supertest");

const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seed");
const data = require("../db/data/test");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  test("404 - path not found", () => {
    return request(app)
      .get("/invalid/endpoint")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found.");
      });
  });
  describe("/api/songs", () => {
    describe("GET", () => {
      test("200 - responds with array of song objects", () => {
        return request(app)
          .get("/api/songs")
          .expect(200)
          .then(({ body: { songs } }) => {
            expect(songs).toBeArray();
            expect(songs.length).toBeGreaterThan(0);
            songs.forEach((song) => {
              expect(song).toBeObject();
            });
          });
      });
      test("each song object has: id, title, artist", () => {
        return request(app)
          .get("/api/songs")
          .then(({ body: { songs } }) => {
            songs.forEach((song) => {
              expect(song).toHaveProperty("song_id");
              expect(song).toHaveProperty("title");
              expect(song).toHaveProperty("release_year");
              expect(song).toHaveProperty("artist");
            });
          });
      });
      test("should accept maxyear query which filters before that year", () => {
        return request(app)
          .get("/api/songs?maxyear=1980")
          .expect(200)
          .then(({ body: { songs } }) => {
            expect(songs.length).toBeGreaterThan(0);
            songs.forEach((song) => {
              expect(song.release_year).toBeLessThanOrEqual(1980);
            });
          });
      });
      test("not a number", () => {
        return request(app)
          .get("/api/songs?maxyear=1")
          .expect(200)
          .then(({ body: { songs } }) => {
            expect(songs.length).toBe(0);
          });
      });
    });
    describe("POST", () => {
      const newSong = {
        song_title: "test song",
        release_year: 2024,
        artist_id: 1,
        genre: "pop",
      };
      test("201 - responds with newly posted song", () => {
        return request(app)
          .post("/api/songs")
          .send(newSong)
          .expect(201)
          .then(({ body: { song } }) => {
            expect(song).toEqual({ song_id: 9, ...newSong });
          });
      });
      test("new song is inserted into db", () => {
        return request(app)
          .post("/api/songs")
          .send(newSong)
          .expect(201)
          .then(() => {
            return db.query("SELECT * FROM songs WHERE song_id = 9;");
          })
          .then(({ rows }) => {
            expect(rows[0]).toEqual({ song_id: 9, ...newSong });
          });
      });
    });
    describe("INVALID METHODS", () => {
      test("405 - method not allowed", () => {
        const methods = ["delete", "patch", "put"];

        return Promise.all(
          methods.map((method) => {
            return request(app)
              [method]("/api/songs")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          })
        );
      });
    });
  });
  describe("/api/songs/:id", () => {
    describe("GET", () => {
      test("200 - responds with matching song object", () => {
        return request(app)
          .get("/api/songs/1")
          .expect(200)
          .then(({ body: { song } }) => {
            expect(song).toHaveProperty("song_id", 1);
            expect(song).toHaveProperty("title", "Cruel Summer");
            expect(song).toHaveProperty("release_year", 2019);
            expect(song).toHaveProperty("artist", "Taylor Swift");
            expect(song).toHaveProperty("genre", "pop");
          });
      });
      test("400 - for invalid id type", () => {
        return request(app)
          .get("/api/songs/banana")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request.");
          });
      });
      test("404 - for valid but non-existent id", () => {
        return request(app)
          .get("/api/songs/1000000")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Song not found.");
          });
      });
    });
  });
  describe("/api/playlists/:id/songs", () => {
    describe("GET", () => {
      test("200 - responds with an array of song objects", () => {
        return request(app)
          .get("/api/playlists/1/songs")
          .expect(200)
          .then(({ body: { songs } }) => {
            expect(songs).toBeArray();
            expect(songs).toHaveLength(4);
            songs.forEach((song) => {
              expect(song).toHaveProperty("song_id");
              expect(song).toHaveProperty("title");
              expect(song).toHaveProperty("release_year");
            });
          });
      });
      test("200 - responds with an empty array for empty playlist", () => {
        return request(app)
          .get("/api/playlists/3/songs")
          .expect(200)
          .then(({ body: { songs } }) => {
            expect(songs).toBeArray();
            expect(songs).toHaveLength(0);
          });
      });
      test("400 - responds for invalid playlist id ", () => {
        return request(app)
          .get("/api/playlists/banana/songs")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request.");
          });
      });
      test("404 - responds for valid but non-existent playlist id", () => {
        return request(app)
          .get("/api/playlists/10000/songs")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Playlist not found.");
          });
      });
    });
  });
});
