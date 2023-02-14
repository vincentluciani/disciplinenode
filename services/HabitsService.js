
require('../schema/Habit')
require('../schema/Progress')
require('../schema/Progress');
const { query } = require('express');

const mongoose = require('mongoose')
const habitsModel = mongoose.model('habits')
const progressModel = mongoose.model('progress')

const getUserHabits = async (queryObject) => {
  return await habitsModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}


const getAll = async (queryObject) => {
/*
  dataArrays.todaysProgressArray
  dataArrays.progressArray 
  dataArrays.habitsArray
*/

  var resultObject = {}

  resultObject.progressArray=await getAllUserProgress(queryObject)
  resultObject.todaysProgressArray = await getUserProgressForDate(queryObject)
  resultObject.habitsArray =  await habitsModel.find({userId:queryObject.userId})
  resultObject.pastProgressArray = await getUserProgressBeforeDate(queryObject)
  resultObject.journalArray = []

  return resultObject
}



const storeUserHabit = async (habitObject) => {
  //const habit = new habitsModel(habitObject)
  //return await habit.save() 

  var query = {habitId:habitObject.habitId,userId:habitObject.userId},
    update = habitObject,
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

// Find the document
try{
  result = await habitsModel.findOneAndUpdate(query, update, options)
} catch(e){
    console.log(e)
    return null
} 
return result


}

const deleteUserHabit = async (queryObject) => {
  /* delete progress also ? */
  return await habitsModel.deleteOne({habitId:queryObject.habitId})
  /* check if what is returned is what was given */
}

/* https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/ */
const updateUserHabit = async (id,habitObject) => {
  const habit = new habitsModel(habitObject)
  return await habit.update({'_id':ObjectID(id)}, {$set: habitObject}, {w:1}, function(err, result){
    console.log(result);
  })
  /* check if what is returned is what was given */
}

const getUserProgressForDate = async (queryObject) => {
  return await progressModel.find({userId:queryObject.userId,progressDate:queryObject.progressDate})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserProgressBeforeDate = async (queryObject) => {
  const isoDate = queryObject.progressDate+"T00:00:00.000Z"
  try{
    result = await progressModel.find({userId:queryObject.userId,progressDateISO:{
      $lt:isoDate
    }})
        /*.sort({date:'desc'})
  .lean()*/
  } catch(err) {
    console.log(err)
  }
  return result;
}

const getAllUserProgress = async (queryObject) => {
  return await progressModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}


const storeUserProgress = async (progressObject) => {
  const isoDate = progressObject.progressDate+"T00:00:00.000Z"
  // const progress = new model(      {
  //     ...progressObject,
  //     progressDateISO: isoDate
  // })
  const modifiedProgressObject = {
      ...progressObject,
      progressDateISO: isoDate
  }



  //const progress = new progressModel(progressObject)

  //   try{
  //     result = await progress.save()
  // } catch(e){
  //   console.log(e)
  //   return null
  // }
  /* check if what is returned is what was given */
  var query = {progressId:progressObject.progressId,userId:progressObject.userId},
  update = modifiedProgressObject,
  options = { upsert: true, new: true, setDefaultsOnInsert: true };

  try{
    result = await progressModel.findOneAndUpdate(query, update, options)
  } catch(e){
      console.log(e)
      return null
  } 
  return result

}

module.exports = {
  getUserHabits: getUserHabits,
  storeUserHabit: storeUserHabit,
  updateUserHabit: updateUserHabit,
  deleteUserHabit: deleteUserHabit,
  getAll: getAll,
  storeUserProgress: storeUserProgress
}
