const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../server');

require('dotenv').config();

describe('GET /exercises', () => {
  it('should return all exercises', async () => {
    const res = await request(app).get('/exercises');

    expect(res.statusCode).toEqual(200);
  });

  it('should return an array of exercises', async () => {
    const res = await request(app).get('/exercises');

    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should return an array of exercises with the correct properties', async () => {
    const res = await request(app).get('/exercises');

    expect(res.body[0]).toHaveProperty('username');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('duration');
    expect(res.body[0]).toHaveProperty('date');
  });

  it('should return an array of exercises with the correct types', async () => {
    const res = await request(app).get('/exercises');

    expect(typeof res.body[0].username).toBe('string');
    expect(typeof res.body[0].description).toBe('string');
    expect(typeof res.body[0].duration).toBe('number');
    expect(typeof res.body[0].date).toBe('string');
  });
});

describe('POST /exercises/add', () => {
  let connection;
  let collection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    collection = await db.collection('exercises');
    collection.deleteMany({ username: 'test' });
  });

  it('should add an exercise', async () => {
    const res = await request(app).post('/exercises/add').send({
      username: 'test',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Exercise added!');
  });

  it('should return an error if username is not provided', async () => {
    const res = await request(app).post('/exercises/add').send({
      username: '',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: ValidationError: username: Path `username` is required.',
    );
  });

  it('should return an error if description is not provided', async () => {
    const res = await request(app).post('/exercises/add').send({
      username: 'test',
      description: '',
      duration: 10,
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: ValidationError: description: Path `description` is required.',
    );
  });

  it('should return an error if duration is not provided', async () => {
    const res = await request(app).post('/exercises/add').send({
      username: 'test',
      description: 'test',
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: ValidationError: duration: Path `duration` is required.',
    );
  });

  it('should return an error if date is not provided', async () => {
    const res = await request(app).post('/exercises/add').send({
      username: 'test',
      description: 'test',
      duration: 10,
      date: '',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: ValidationError: date: Path `date` is required.',
    );
  });
});

describe('GET /exercises/:id', () => {
  it('should return an exercise with the correct properties', async () => {
    const res = await request(app).get('/exercises/632b90bcbf8d9e4f0545d235');

    expect(res.body).toHaveProperty('username');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('duration');
    expect(res.body).toHaveProperty('date');
  });

  it('should return an exercise with the correct types', async () => {
    const res = await request(app).get('/exercises/632b90bcbf8d9e4f0545d235');

    expect(typeof res.body.username).toBe('string');
    expect(typeof res.body.description).toBe('string');
    expect(typeof res.body.duration).toBe('number');
    expect(typeof res.body.date).toBe('string');
  });

  it('should return an error if the exercise id is not found', async () => {
    const res = await request(app).get('/exercises/123');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: CastError: Cast to ObjectId failed for value "123" (type string) at path "_id" for model "exercises"',
    );
  });
});

describe('DELETE /exercises/:id', () => {
  let connection;
  let collection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    collection = await db.collection('exercises');
    collection.deleteMany({ username: 'deleteHim' });
    const toDelete = await request(app).post('/exercises/add').send({
      username: 'deleteHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });
  });

  afterAll(async () => {
    const toDelete = await request(app).post('/exercises/add').send({
      username: 'deleteHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });
  });

  it('should delete an exercise', async () => {
    const objectToDelete = await collection.findOne({ username: 'deleteHim' });
    const id = objectToDelete._id.toString();
    const res = await request(app).delete(`/exercises/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Exercise deleted.');
  });

  it('should return an error if the exercise id is not found', async () => {
    const res = await request(app).delete('/exercises/123');

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: CastError: Cast to ObjectId failed for value "123" (type string) at path "_id" for model "exercises"',
    );
  });

  it('should return an error if the exercise id is not provided', async () => {
    const res = await request(app).delete('/exercises/');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({});
  });
});

describe('UPDATE /exercises/update/:id', () => {
  let connection;
  let collection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    collection = await db.collection('exercises');
    collection.deleteMany({ username: 'updateHim' });
    const toUpdate = await request(app).post('/exercises/add').send({
      username: 'updateHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });
  });

  afterAll(async () => {
    const toUpdate = await request(app).post('/exercises/add').send({
      username: 'updateHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });
  });

  it('should update an exercise', async () => {
    const objectToUpdate = await collection.findOne({ username: 'updateHim' });
    const id = objectToUpdate._id.toString();
    const res = await request(app).post(`/exercises/update/${id}`).send({
      username: 'updateHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Exercise updated!');
  });

  it('should return an error if the exercise id is not found', async () => {
    const res = await request(app).post('/exercises/update/123').send({
      username: 'updateHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: CastError: Cast to ObjectId failed for value "123" (type string) at path "_id" for model "exercises"',
    );
  });

  it('should return an error if the exercise id is not provided', async () => {
    const res = await request(app).post('/exercises/update/').send({
      username: 'updateHim',
      description: 'test',
      duration: 10,
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({});
  });

  it('should return an error if the duration is not provided', async () => {
    const objectToUpdate = await collection.findOne({ username: 'updateHim' });
    const id = objectToUpdate._id.toString();
    const res = await request(app).post(`/exercises/update/${id}`).send({
      username: 'updateHim',
      description: 'test',
      date: '2020-01-01',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual(
      'Error: ValidationError: duration: Cast to Number failed for value "NaN" (type number) at path "duration"',
    );
  });
});
