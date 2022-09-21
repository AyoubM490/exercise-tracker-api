const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const exerciseSchema = new Schema(
  {
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

const Exercise = mongoose.model('exercises', exerciseSchema);

module.exports = {
  getExercises: () => Exercise.find(),
  getExercise: (exerciseId) => Exercise.findById(exerciseId),
  addExercise: (exercise) => {
    const newExercise = new Exercise(exercise);
    return newExercise.save();
  },
  deleteExercise: (exerciseId) => Exercise.findByIdAndDelete(exerciseId),
  Exercise,
};
