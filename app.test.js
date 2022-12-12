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
  test("Should respond with an array of topics objects each with the properties of slug and description.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body).toBeInstanceOf(Object);
        expect(Object.keys(body)).toEqual(["topics"]);
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