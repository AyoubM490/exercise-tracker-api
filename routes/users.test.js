const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../server');

require('dotenv').config();

const getUsers = jest.fn();
const addUser = jest.fn();

describe('GET /users', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/users');

    expect(res.statusCode).toEqual(200);
  });

  it('should return an array of users', async () => {
    const res = await request(app).get('/users');

    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

describe('POST /users/add', () => {
  let connection;
  let collection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    collection = await db.collection('users');
    collection.deleteMany({ username: 'test' });
  });

  it('should add a user', async () => {
    const res = await request(app).post('/users/add').send({
      username: 'test',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('User added!');
  });

  it('should return an error if username is not provided', async () => {
    const res = await request(app).post('/users/add').send({
      username: '',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: ValidationError: username: Path `username` is required.',
    );
  });

  afterAll(async () => {
    await connection.close();
  });
});
