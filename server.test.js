const express = require('express');
const request = require('supertest');

require('dotenv').config();

function createApp() {
  const app = express();
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  return app;
}

describe('GET /', () => {
  it('should return 200 OK', () => {
    process.env.SERVER = true;
    const app = createApp();
    request(app).get('/').expect(200);
  });
});
