const request = require('supertest');
const app = require('./app');
const db = require('./db/connection');
const seed = require("./db/seeds/seed");
const data = require("./db/data/test-data/index");

afterAll(() => {
    if (db.end) db.end();
});

beforeEach(() => seed(data));

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
  });