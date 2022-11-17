
require('../schema/Habit');
const mongoose = require('mongoose');
const model = mongoose.model('habits');


const getUserProgressForDate = async (queryObject) => {
  return await model.find({userId:queryObject.userId,date:queryObject.date})
      /*.sort({date:'desc'})
.lean()*/
}

const storeUserProgress = async (progressObject) => {
  const habit = new model(progressObject)
  return await habit.save() 
  /* check if what is returned is what was given */
}

module.exports = {
  getUserProgressForDate: getUserProgressForDate,
  storeUserProgress: storeUserProgress
}
