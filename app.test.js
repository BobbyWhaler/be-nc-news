const request = require('supertest');
const app = require('./app');
const db = require('./db/connection');
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data/index");

afterAll(() => {
    if (db.end) db.end();
});

beforeEach(() => seed(data));

describe('app', () => {
  test('404: non-existant route', () => {
    return request(app)
    .get('/api/headline')
    .expect(404)
    .then((response) => {
      const msg = response.body
      expect(msg).toEqual({ message: "Not Found" });
    })
  })
})

describe('1. GET /api', () => {
    test('Should respond with a json object containing a "message" key', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeInstanceOf(Object);
            expect(Object.keys(body)).toEqual(["message"]);
            expect(body.message).toBe("all ok");
        })
    })
})
describe("2. GET /api/topics", () => {
  test("200: Should respond with an array of topics objects each with the properties of slug and description.", () => {
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
describe("3. GET /api/articles", () => {
    test("200: Should respond with an array of article objects each with the properties of author, title, article_id, topic, created_at, votes and comment_count.", () => {
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
              comment_count: expect.any(String)
            });
            // need to test for in order of descending which it does already - just unsure on best way how
          });
        });
    });
    test("200: should return the correct amount of comments for each article", () => {
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

describe("4. GET /api/articles/:article_id", () => {
  test("200, responds with a single matching article", () => {
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
  test('404: non-existant route', () => {
    return request(app)
    .get('/api/articles/999')
    .expect(404)
    .then((response) => {
      const msg = response.body;
      expect(msg).toEqual({ message: "Not Found" });
    });
  })
  test('400: Invalid ID', () => {
    return request(app)
    .get('/api/articles/notAnID')
    .expect(400)
    .then((response) => {
      const msg = response.body
      expect(msg).toEqual({ message: "Bad Request" });
    })
  })
});