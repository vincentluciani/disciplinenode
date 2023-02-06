
require('../schema/Progress');
const mongoose = require('mongoose');
const model = mongoose.model('progress');


const getUserProgressForDate = async (queryObject) => {
  return await model.find({userId:queryObject.userId,date:queryObject.date})
      /*.sort({date:'desc'})
.lean()*/
}

const storeUserProgress = async (progressObject) => {
  const progress = new model(progressObject)
  return await progress.save() 
  /* check if what is returned is what was given */
}

module.exports = {
  getUserProgressForDate: getUserProgressForDate,
  storeUserProgress: storeUserProgress
}
