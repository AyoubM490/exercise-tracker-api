const { MongoClient } = require('mongodb');

require('dotenv').config();

describe('User Model Tests', () => {
  let connection;
  let collection;
  let db;

  beforeAll(async () => {
    connection = await new MongoClient(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db('test');
    collection = db.collection('usersTest');
  });

  afterAll(async () => {
    await connection.close();
  });

  afterEach(async () => {
    await collection.deleteMany({ username: 'test' });
  });

  it('should insert an user into collection', async () => {
    const usersTest = db.collection('usersTest');

    const mockUser = {
      username: 'test',
    };
    await usersTest.insertOne(mockUser);

    const inserteduser = await usersTest.findOne({ username: 'test' });
    expect(inserteduser).toEqual(mockUser);
  });

  it('should delete an user from collection', async () => {
    const usersTest = db.collection('usersTest');

    const mockUser = {
      username: 'test',
    };
    await usersTest.insertOne(mockUser);

    const inserteduser = await usersTest.findOne({ username: 'test' });
    expect(inserteduser).toEqual(mockUser);

    await usersTest.deleteOne({ username: 'test' });
    const deleteduser = await usersTest.findOne({ username: 'test' });
    expect(deleteduser).toBeNull();
  });

  it('Should find all users in collection', async () => {
    const usersTest = db.collection('usersTest');

    const mockUser1 = {
      username: 'test1',
    };

    const mockUser2 = {
      username: 'test2',
    };

    await usersTest.insertMany([mockUser1, mockUser2]);

    const allusers = await usersTest.find().toArray();
    expect(allusers.length).toBe(2);
  });
});
