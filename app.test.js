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
        expect(body.articles).toEqual([
          {
            article_id: 3,
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'some gifs',
            created_at: '2020-11-03T09:12:00.000Z',
            votes: 0,
            comment_count: '2'
          },
          {
            article_id: 6,
            title: 'A',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Delicious tin of cat food',
            created_at: '2020-10-18T01:00:00.000Z',
            votes: 0,
            comment_count: '1'
          },
          {
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            comment_count: '0'
          },
          {
            article_id: 12,
            title: 'Moustache',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Have you seen the size of that thing?',
            created_at: '2020-10-11T11:24:00.000Z',
            votes: 0,
            comment_count: '0'
          },
          {
            article_id: 5,
            title: 'UNCOVERED: catspiracy to bring down democracy',
            topic: 'cats',
            author: 'rogersop',
            body: 'Bastet walks amongst us, and the cats are taking arms!',
            created_at: '2020-08-03T13:14:00.000Z',
            votes: 0,
            comment_count: '2'
          },
          {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            comment_count: '11'
          },
          {
            article_id: 9,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: '2020-06-06T09:10:00.000Z',
            votes: 0,
            comment_count: '2'
          },
          {
            article_id: 10,
            title: 'Seven inspirational thought leaders from Manchester UK',
            topic: 'mitch',
            author: 'rogersop',
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: '2020-05-14T04:15:00.000Z',
            votes: 0,
            comment_count: '0'
          },
          {
            article_id: 4,
            title: 'Student SUES Mitch!',
            topic: 'mitch',
            author: 'rogersop',
            body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
            created_at: '2020-05-06T01:14:00.000Z',
            votes: 0,
            comment_count: '0'
          },
          {
            article_id: 8,
            title: 'Does Mitch predate civilisation?',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!',
            created_at: '2020-04-17T01:08:00.000Z',
            votes: 0,
            comment_count: '0'
          },
          {
            article_id: 11,
            title: 'Am I a cat?',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
            created_at: '2020-01-15T22:21:00.000Z',
            votes: 0,
            comment_count: '0'
          },
          {
            article_id: 7,
            title: 'Z',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'I was hungry.',
            created_at: '2020-01-07T14:08:00.000Z',
            votes: 0,
            comment_count: '0'
          }
        ]);
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

describe("8. PATCH /api/articles/:article_id", () => {
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

describe("9. GET /api/users", () => {
  test("status:200, Should respond with an array of user objects each with the properties of username, name and avatar_url.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});

describe("10. GET /api/articles (queries)", () => {
  test("status:200, GET /api/articles?topic Should respond with an array of article objects with the stated topic property", () => {
    const query = "topic";
    const queryValue = "mitch";
    const queryStatement = `?${query}=${queryValue}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(11);
        body.articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("status:200, GET /api/articles?sort_by Should respond with an array of article objects sorted by in order of the stated  property", () => {
    const query = "sort_by";
    const queryValue = "article_id";
    const queryStatement = `?${query}=${queryValue}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        expect(body.articles[0]).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: "11",
        });
        expect(body.articles[11]).toEqual({
          article_id: 12,
          title: "Moustache",
          topic: "mitch",
          author: "butter_bridge",
          body: "Have you seen the size of that thing?",
          created_at: "2020-10-11T11:24:00.000Z",
          votes: 0,
          comment_count: "0",
        });
      });
  });
  test("status:200, GET /api/articles?sort_by Should default to order of date DESC when not given a query value", () => {
    const query = "sort_by";
    const queryStatement = `?${query}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        expect(body.articles[0]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: "2",
        });
        expect(body.articles[11]).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          comment_count: "0",
        });
      });
  });
  test("status:200, GET /api/articles?order Should order the articles into DESC or ASC order when specified", () => {
    const query = "order";
    const queryValue = "asc";
    const queryStatement = `?${query}=${queryValue}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        expect(body.articles[0]).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          comment_count: "0",
        });
        expect(body.articles[11]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: "2",
        });
      });
  });
  test("status:200, GET /api/articles?order Should default to order DESC when not given a query value", () => {
    const query = "order";
    const queryStatement = `?${query}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        expect(body.articles[0]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: "2",
        });
        expect(body.articles[11]).toEqual({
          article_id: 7,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          comment_count: "0",
        });
      });
  });
  test("status:400, (sort_by) query value doesn't exist in the database", () => {
    const query = "sort_by";
    const queryValue = "cabbage";
    const queryStatement = `?${query}=${queryValue}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Invalid sort_by query" });
      });
  });
  test("status:404, (topic) query value not found in the database", () => {
    const query = "topic";
    const queryValue = "teeth";
    const queryStatement = `?${query}=${queryValue}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(404)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Topic Not Found" });
      });
  });
  test("status:400, (order) query value doesn't exist in the database", () => {
    const query = "order";
    const queryValue = "DOWN";
    const queryStatement = `?${query}=${queryValue}`;
    return request(app)
      .get(`/api/articles${queryStatement}`)
      .expect(400)
      .then((response) => {
        const body = response.body;
        expect(body).toEqual({ message: "Invalid order query" });
      });
  });
});

