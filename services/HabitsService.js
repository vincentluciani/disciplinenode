
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

const deleteUserHabit = async (queryObject) => {
  return await model.deleteOne({habitId:queryObject.habitId})
  /* check if what is returned is what was given */
}

/* https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/ */
const updateUserHabit = async (id,habitObject) => {
  const habit = new model(habitObject)
  return await habit.update({'_id':ObjectID(id)}, {$set: habitObject}, {w:1}, function(err, result){
    console.log(result);
  })
  /* check if what is returned is what was given */
}

module.exports = {
  getUserHabits: getUserHabits,
  storeUserHabit: storeUserHabit,
  updateUserHabit: updateUserHabit,
  deleteUserHabit: deleteUserHabit
}
