
require('../schema/Habit');
const mongoose = require('mongoose');
const model = mongoose.model('habits');


const getUserHabits = async (queryObject) => {
  return await model.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}

const storeUserHabit = async (habitObject) => {
  const habit = new model(habitObject)
  return await habit.save() 
  /* check if what is returned is what was given */
}

module.exports = {
  getUserHabits: getUserHabits,
  storeUserHabit: storeUserHabit
}
