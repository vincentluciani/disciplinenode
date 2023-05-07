
require('../schema/Habit')
require('../schema/Progress')
require('../schema/Journal');
const { query } = require('express');

const mongoose = require('mongoose')
const habitsModel = mongoose.model('habits')

const progressModel = mongoose.model('progress')
const journalModel = mongoose.model('journal')

const getUserHabits = async (queryObject) => {
  return await habitsModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}

const getAll = async (queryObject) => {
  var resultObject = {}

  resultObject.progressArray=await getAllUserProgress(queryObject)
  resultObject.todaysProgressArray = await getUserProgressForDate(queryObject)
  resultObject.habitsArray =  await habitsModel.find({userId:queryObject.userId})
  resultObject.pastProgressArray = await getUserProgressBeforeDate(queryObject)
  resultObject.journalArray = await getUserJournal(queryObject)

  return resultObject
}

const storeUserHabit = async (habitObject) => {
  var query = {habitId:habitObject.habitId,userId:habitObject.userId},
        update = habitObject,
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

  result = await habitsModel.findOneAndUpdate(query, update, options)

return result
}

const deleteUserHabit = async (queryObject) => {
  return await habitsModel.deleteOne({habitId:queryObject.id,userId:queryObject.userId})
  /* check if what is returned is what was given */
}

const deleteUserProgress = async (queryObject) => {
  return await progressModel.deleteOne({progressId:queryObject.id,userId:queryObject.userId})
  /* check if what is returned is what was given */
}

const getUserProgressForDate = async (queryObject) => {
  return await progressModel.find({userId:queryObject.userId,progressDate:queryObject.progressDate})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournalForDate = async (queryObject) => {
  return await journalModel.find({userId:queryObject.userId,journalDate:queryObject.date})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournal = async (queryObject) => {
  return await journalModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}


const getUserProgressBeforeDate = async (queryObject) => {
  const isoDate = queryObject.progressDate+"T00:00:00.000Z"

  result = await progressModel.find({userId:queryObject.userId,progressDateISO:{
    $lt:isoDate
  }})
        /*.sort({date:'desc'})
  .lean()*/

  return result;
}

const getAllUserProgress = async (queryObject) => {
  return await progressModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}

const storeUserJournal = async (journalObject) => {

  var query = {journalDate:journalObject.journalDate,userId:journalObject.userId},
    update = journalObject,
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  result = await journalModel.findOneAndUpdate(query, update, options)

  return result
}
const storeUserProgress = async (progressObject) => {

  const isoDate = progressObject.progressDate+"T00:00:00.000Z"

  /* If we find an entry with same user and progress id created after, we do not do anything */
  result = await progressModel.find({userId:progressObject.userId,progressId:progressObject.progressId,whenUpdated:{$gt:progressObject.whenUpdated}})

  if (result && (result.length > 0)){
    return null
  }

  const modifiedProgressObject = {
      ...progressObject,
      progressDateISO: isoDate
  }

  var query = {progressId:progressObject.progressId,userId:progressObject.userId},
  update = modifiedProgressObject,
  options = { upsert: true, new: true, setDefaultsOnInsert: true };

  result = await progressModel.findOneAndUpdate(query, update, options)

  return result

}

module.exports = {
  getUserHabits: getUserHabits,
  storeUserHabit: storeUserHabit,
  deleteUserHabit: deleteUserHabit,
  deleteUserProgress: deleteUserProgress,
  getAll: getAll,
  storeUserProgress: storeUserProgress,
  storeUserJournal: storeUserJournal,
  getUserJournalForDate: getUserJournalForDate
}
