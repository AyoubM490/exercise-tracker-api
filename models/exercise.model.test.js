const { MongoClient } = require('mongodb');

require('dotenv').config();

describe('Exercise Model tests', () => {
  let connection;
  let collection;
  let db;

  beforeAll(async () => {
    connection = await new MongoClient(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db('test');
    collection = db.collection('exercisesTest');
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    await collection.deleteMany();
  });

  it('should insert an exercise into collection', async () => {
    const exercisesTest = db.collection('exercisesTest');

    const mockExercise = {
      username: 'test',
      description: 'test',
      duration: 1,
      date: new Date(),
    };
    await exercisesTest.insertOne(mockExercise);

    const insertedExercise = await exercisesTest.findOne({ username: 'test' });
    expect(insertedExercise).toEqual(mockExercise);
  });

  it('should delete an exercise from collection', async () => {
    const exercisesTest = db.collection('exercisesTest');

    const mockExercise = {
      username: 'test',
      description: 'test',
      duration: 1,
      date: new Date(),
    };
    await exercisesTest.insertOne(mockExercise);

    const insertedExercise = await exercisesTest.findOne({ username: 'test' });
    expect(insertedExercise).toEqual(mockExercise);

    await exercisesTest.deleteOne({ username: 'test' });
    const deletedExercise = await exercisesTest.findOne({ username: 'test' });
    expect(deletedExercise).toBeNull();
  });

  it('Should find all exercises in collection', async () => {
    const exercisesTest = db.collection('exercisesTest');

    const mockExercise1 = {
      username: 'test1',
      description: 'test1',
      duration: 1,
      date: new Date(),
    };

    const mockExercise2 = {
      username: 'test2',
      description: 'test2',
      duration: 2,
      date: new Date(),
    };

    await exercisesTest.insertMany([mockExercise1, mockExercise2]);

    const allExercises = await exercisesTest.find().toArray();
    expect(allExercises.length).toBe(2);
  });
});
