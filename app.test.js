const request = require("supertest");
const app = require("./app");
const db = require("./db/connection");
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data/index");

afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => seed(data));

describe("1. app", () => {
  test("status:404, non-existant route", () => {
    return request(app)
      .get("/api/headline")
      .expect(404)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Not Found" });
      });
  });
});

describe("2. GET /api", () => {
  test('status:200, Should respond with a json object containing a "message" key', () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(Object.keys(body)).toEqual(["message"]);
        expect(body.message).toBe("all ok");
      });
  });
});
describe("3. GET /api/topics", () => {
  test("status:200, Should respond with an array of topics objects each with the properties of slug and description.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("4. GET /api/articles", () => {
  test("status:200, Should respond with an array of article objects each with the properties of author, title, article_id, topic, created_at, votes and comment_count.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
          // need to test for in order of descending which it does already - just unsure on best way how
        });
      });
  });
  test("status:200, should return the correct amount of comments for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles[0].comment_count).toBe("2");
        expect(articles[1].comment_count).toBe("1");
      });
  });
});

describe("5. GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article", () => {
    const article_ID = 2;
    return request(app)
      .get(`/api/articles/${article_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: expect.any(String),
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
        });
      });
  });
  test("status:404, non-existant route", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Not Found" });
      });
  });
  test("status:400, Invalid ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Bad Request" });
      });
  });
});
describe("6. GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with comments under the specific article in order of most recently created", () => {
    const article_ID = 3;
    return request(app)
      .get(`/api/articles/${article_ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([
          {
            comment_id: 11,
            votes: 0,
            created_at: "2020-09-19T23:10:00.000Z",
            author: "icellusedkars",
            body: "Ambidextrous marsupial",
          },
          {
            comment_id: 10,
            votes: 0,
            created_at: "2020-06-20T07:24:00.000Z",
            author: "icellusedkars",
            body: "git push origin master",
          },
        ]);
      });
  });
  test("status:200, responds with empty array if article has no comments", () => {
    const article_ID = 7;
    return request(app)
      .get(`/api/articles/${article_ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("status:404, non-existant route", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Not Found" });
      });
  });
  test("status:400, Invalid ID", () => {
    return request(app)
      .get("/api/articles/notAnID/comments")
      .expect(400)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Bad Request" });
      });
  });
});
describe("7. POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with a comment newly added to the database", () => {
    const newComment = {
      username: "butter_bridge",
      body: "rich flex",
    };
    const article_ID = 3;
    return request(app)
      .post(`/api/articles/${article_ID}/comments`)
      .send(newComment, article_ID)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          comment_id: 19,
          body: "rich flex",
          article_id: 3,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status:404, non-existant article", () => {
    const requestBody = { username: "butter_bridge", body: "BUTTER" };
    return request(app)
      .post("/api/articles/999/comments")
      .send(requestBody, 999)
      .expect(404)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Not Found" });
      });
  });
  test("status:404 should respond with a status 404 and error message Not Found when sent an object with correct properties but username does not exist", () => {
    const requestBody = { username: "ham", body: "chowder" };
    const article_ID = 2;
    return request(app)
      .post(`/api/articles/${article_ID}/comments`)
      .send(requestBody, article_ID)
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Not Found" });
      });
  });
  test("status:400, responds with an appropriate error message when the user sends a comment object with incorrect data types", () => {
    const requestBody = {
      username: "butter_bridge",
      body: { spark: 343 },
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(requestBody)
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Bad Request" });
      });
  });
  test("status:400, should respond with a status 400 and error message Bad Request when sent a object with a malformed body", () => {
    const requestBody = {};
    return request(app)
      .post("/api/articles/7/comments")
      .send(requestBody)
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Bad Request" });
      });
  });
  test("status:400, should return a 400 Bad Request error when endpoint provided an id that is the wrong data type", () => {
    return request(app)
      .post("/api/articles/bosh/comments")
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Bad Request" });
      });
  });
});
describe.only("8. PATCH /api/articles/:article_id", () => {
  test("status:200, responds with the updated article", () => {
    const voteUpdates = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdates)
      .expect(200)
      .then((response) => {
        const body = response.body.article;
        expect(body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 150,
        });
      });
  });
  test("status:404, non-existant route", () => {
    const voteUpdates = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/999")
      .send(voteUpdates)
      .expect(404)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Not Found" });
      });
  });
  test("status:400, Invalid ID (wrong data type)", () => {
    const voteUpdates = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/notAnID")
      .send(voteUpdates)
      .expect(400)
      .then((response) => {
        const msg = response.body;
        expect(msg).toEqual({ message: "Bad Request" });
      });
  });
  test("status:400, should respond with a status 400 and error message Bad Request when sent a object with a malformed body", () => {
    const requestBody = {};
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Bad Request" });
      });
  });
  test("status:400, responds with an appropriate error message when the user sends a votes object with incorrect data types", () => {
    const requestBody = { inc_votes: "50" };
    return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Bad Request" });
      });
  });
});
