
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

const getAll = async (queryObject,logger) => {
  var resultObject = {}

  resultObject.progressArray=await getAllUserProgress(queryObject)
  resultObject.todaysProgressArray = await getUserProgressForDate(queryObject)
  resultObject.habitsArray =  await habitsModel.find({userId:queryObject.userId})
  resultObject.pastProgressArray = await getUserProgressBeforeDate(queryObject)
  resultObject.journalArray = await getUserJournal(queryObject)

  return resultObject
}

const storeUserHabit = async (habitObject,logger) => {
  var query = {habitId:habitObject.habitId,userId:habitObject.userId},
        update = habitObject,
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

  result = await habitsModel.findOneAndUpdate(query, update, options)

return result
}

const deleteUserHabit = async (queryObject,logger) => {
  return await habitsModel.deleteOne({habitId:queryObject.id,userId:queryObject.userId})
  /* check if what is returned is what was given */
}

const deleteUserProgress = async (queryObject,logger) => {
  return await progressModel.deleteOne({progressId:queryObject.id,userId:queryObject.userId})
  /* check if what is returned is what was given */
}

const getUserProgressForDate = async (queryObject,logger) => {
  return await progressModel.find({userId:queryObject.userId,progressDate:queryObject.progressDate})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournalForDate = async (queryObject,logger) => {
  return await journalModel.find({userId:queryObject.userId,journalDate:queryObject.date})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournal = async (queryObject,logger) => {
  return await journalModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}


const getUserProgressBeforeDate = async (queryObject,logger) => {
  const isoDate = queryObject.progressDate+"T00:00:00.000Z"

  result = await progressModel.find({userId:queryObject.userId,progressDateISO:{
    $lt:new Date(isoDate)
  }})
        /*.sort({date:'desc'})
  .lean()*/

  return result;
}

const getAllUserProgress = async (queryObject,logger) => {
  return await progressModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}

const storeUserJournal = async (journalObject,logger) => {

  var query = {journalDate:journalObject.journalDate,userId:journalObject.userId},
    update = journalObject,
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  result = await journalModel.findOneAndUpdate(query, update, options)

  return result
}
const storeUserProgress = async (progressObject,logger) => {

  const isoDate = progressObject.progressDate+"T00:00:00.000Z"

  const emptyResult = {
    ok: true
  }

  let action = ""

  /* Looking for another entry with the same habit id and progress date */
  result = await progressModel.find({userId:progressObject.userId,habitId:progressObject.habitId,progressDate:progressObject.progressDate})
  let whenNewResultUpdated = new Date(progressObject.whenUpdated)
  let whenNewResultCreated = new Date(progressObject.whenCreated)
  
  if (result && (result.length > 0)){
    
    //let whenDatabaseResultUpdated = new Date(result[0].whenUpdated)
    let whenDatabaseResultUpdated = result[0].whenUpdated
    
    if (whenNewResultUpdated > whenDatabaseResultUpdated){
      if (whenNewResultUpdated > whenNewResultCreated){
        action = "update"
        logger.debug("result:action is update because new update > old update and new update > new created, progress:"+progressObject.numberOfCompletions+" progressId:"+progressObject.habitId.toString()+
        "new added:"+whenNewResultUpdated.toString()+
        "new updated:"+whenNewResultCreated.toString()+
        "old updated:"+whenDatabaseResultUpdated.toString())
      } else {
        logger.debug("result:no action because new update > old update and new update= new created, progress:"+progressObject.numberOfCompletions+" progressId:"+progressObject.habitId.toString()+
        "new added:"+whenNewResultUpdated.toString()+
        "new updated:"+whenNewResultCreated.toString()+
        "old updated:"+whenDatabaseResultUpdated.toString())
        return emptyResult
      }
    } else {
      logger.debug("result:no action because new update = old update, progress:"+progressObject.numberOfCompletions+" progressId:"+progressObject.habitId.toString()+
        "new added:"+whenNewResultUpdated.toString()+
        "new updated:"+whenNewResultCreated.toString()+
        "old updated:"+whenDatabaseResultUpdated.toString())
      return emptyResult
    }
  } else {
    action = "add"
    logger.debug("result:action is add because no old record,progress:"+progressObject.numberOfCompletions+" progressId:"+progressObject.habitId.toString()+
    "new added:"+whenNewResultUpdated.toString()+
    "new updated:"+whenNewResultCreated.toString())
  }

  const modifiedProgressObject = {
      ...progressObject,
      progressDateISO: isoDate
  }

  let query = ""
  if (action == "update"){
    query = {userId:progressObject.userId,habitId:progressObject.habitId,progressDate:progressObject.progressDate}
    options = { upsert: false, new: true, setDefaultsOnInsert: true }
    result = await progressModel.findOneAndUpdate(query, modifiedProgressObject, options) 
  } else if (action == "add"){
    let objectToInsert = new progressModel(modifiedProgressObject)
    result = await objectToInsert.save(modifiedProgressObject)
  } else {
    return emptyResult;
  }
  
  
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
