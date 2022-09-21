const mockingoose = require('mockingoose');
const { Exercise } = require('./exercise.model');
const {
  getExercises,
  getExercise,
  addExercise,
  deleteExercise,
} = require('./exercise.model');

describe('Exercise service', () => {
  const invalidExercise = {};

  it('Should throw validation error', async () => {
    const exercise = new Exercise(invalidExercise);
    await expect(exercise.validate()).rejects.toThrow();
  });

  describe('getExercises', () => {
    it('Should return all exercises', async () => {
      const exercises = [
        {
          username: 'test',
          description: 'test',
          duration: 10,
          date: new Date(),
        },
        {
          username: 'test2',
          description: 'test2',
          duration: 20,
          date: new Date(),
        },
      ];

      mockingoose(Exercise).toReturn(exercises, 'find');

      const result = await getExercises();
      expect(result[0].username).toBe('test');
    });
  });

  describe('getExercise', () => {
    it('Should return an exercise', async () => {
      const exercise = {
        username: 'test',
        description: 'test',
        duration: 10,
        date: new Date(),
      };

      mockingoose(Exercise).toReturn(exercise, 'findOne');

      const result = await getExercise('123');
      expect(result.username).toBe('test');
    });
  });

  describe('addExercise', () => {
    it('Should add an exercise', async () => {
      const exercise = {
        username: 'test',
        description: 'test',
        duration: 10,
        date: new Date(),
      };

      const newExercise = await addExercise(exercise);

      expect(newExercise.username).toBe('test');
    });
  });

  describe('deleteExercise', () => {
    it('Should delete an exercise', async () => {
      const exercise = {
        username: 'test',
        description: 'test',
        duration: 10,
        date: new Date(),
      };

      mockingoose(Exercise).toReturn(exercise, 'findOneAndDelete');

      const result = await deleteExercise('123');
      expect(result.username).toBe('test');
    });
  });
});
