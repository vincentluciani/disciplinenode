
require('../schema/Habit')
require('../schema/Progress')
require('../schema/Journal')
const {formatDate, toDateTime} = require('../utils/dateFormatting')
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

const getAllToday = async (queryObject,logger) => {
  var resultObject = {}

  resultObject.todaysProgressArray = await getUserProgressForDate(queryObject)
  resultObject.habitsArray =  await habitsModel.find({userId:queryObject.userId})
  resultObject.todaysProgressArray = await completeTodayProgress(resultObject.todaysProgressArray,resultObject.habitsArray,queryObject.progressDateTime)
  resultObject.journalArray = await getUserJournalToday(queryObject,queryObject.progressDateTime)
  return resultObject
}

const getAll = async (queryObject,logger) => {
  var resultObject = {}

  resultObject.journalArray = await getUserJournal(queryObject)
  // resultObject.progressArray=await getAllUserProgress(queryObject)
  // resultObject.todaysProgressArray = await getUserProgressForDate(queryObject)
  // // resultObject.habitsArray =  await habitsModel.find({userId:queryObject.userId})
  resultObject.pastProgressArray = await getUserProgressBeforeDate(queryObject)


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
  const formattedProgressDate = formatDate(queryObject.progressDateTime)
  return await progressModel.find({userId:queryObject.userId,progressDate:formattedProgressDate})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournalForDate = async (queryObject,logger) => {
  return await journalModel.find({userId:queryObject.userId,journalDate:queryObject.requestDate})
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournalToday = async(queryObject,progressDateTime,logger) => {
  var currentDate = formatDate(progressDateTime);
  return await journalModel.find({userId:queryObject.userId,journalDate:currentDate})
}
const getUserJournal = async (queryObject,logger) => {
  return await journalModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}


const getUserProgressBeforeDate = async (queryObject,logger) => {
  const isoDate = formatDate(queryObject.progressDateTime)+"T00:00:00.000Z"

  result = await progressModel.find({userId:queryObject.userId,progressDateISO:{
    $lt:new Date(isoDate)
  }}).sort({progressDateISO:-1})
        /*.sort({date:'desc'})
  .lean()*/

  return result;
}

const getAllUserProgress = async (queryObject,logger) => {
  return await progressModel.find({userId:queryObject.userId})
/*.lean()*/
}

const storeUserJournal = async (journalObject,logger) => {

  var query = {journalDate:journalObject.journalDate,userId:journalObject.userId},
    update = journalObject,
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  result = await journalModel.findOneAndUpdate(query, update, options)

  return result
}
const storeUserProgress = async (progressObject,logger) => {

  //const formattedRequestDate = formatDate(progressObject.progressDateTime)
  const isoDate = progressObject.progressDate +"T00:00:00.000Z"

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

const completeTodayProgress = async (progressArray,habitsArray,currentDateTime) => {
  
  let newProgressArray = progressArray
  for (habit of habitsArray){
    let progressExist = false
    for (progress of progressArray){
      if (progress.habitId == habit.habitId ){
        progressExist = true
      }
    }
    if (!progressExist && isDayOfWeekInHabitWeeks(currentDateTime,habit.weekDay)){
      let newProgress = await createProgressBasedOnHabit(habit,currentDateTime)
      newProgressArray.push(newProgress)
    }
  }
  return newProgressArray
}

const createProgressBasedOnHabit = async (habit,currentDateTime) => {

  var currentDate = formatDate(currentDateTime);

  let newProgressObject =  {
    progressId: habit.habitId + "_" + currentDate,
    habitId: habit.habitId,
    userId: habit.userId,
    habitDescription: habit.habitDescription,
    isCritical: habit.isCritical,
    isSuspendableDuringOtherCases: habit.isSuspendableDuringOtherCases,
    isSuspendableDuringSickness: habit.isSuspendableDuringSickness,
    isTimerNecessary: habit.isTimerNecessary,
    status: "active",
    order: habit.order,
    target: habit.target,
    timerInitialNumberOfMinutes: habit.timerInitialNumberOfMinutes,
    weekDay: habit.weekDay,
    progressDateISO:currentDate+"T00:00:00.000Z",
    progressDate: currentDate,
    numberOfCompletions: 0,
    whatUpdated: "backend createProgressBasedOnHabit",
    whenUpdated: toDateTime(currentDateTime),
    whatCreated: "backend createProgressBasedOnHabit",
    whenCreated: toDateTime(currentDateTime)
  }

  let objectToInsert = new progressModel(newProgressObject)
  result = await objectToInsert.save(objectToInsert)

  return newProgressObject

}

var isDayOfWeekInHabitWeeks = function(currentDateTime, stringOfWeekDays){

    var weekDayNumbers = {
      1:'monday',
      2:'tuesday',
      3:'wednesday',
      4:'thursday',
      5:'friday',
      6:'saturday',
      0:'sunday'
  }
  var currentDayOfWeek = currentDateTime.dayOfWeek;
  var currentDayOfWeekString = weekDayNumbers[currentDayOfWeek];

  var arrayOfWeekDays = stringOfWeekDays.split(" ");
  
  const index = arrayOfWeekDays.indexOf(currentDayOfWeekString);
  
  return (index > -1);
}

module.exports = {
  getUserHabits: getUserHabits,
  getAllToday: getAllToday,
  storeUserHabit: storeUserHabit,
  deleteUserHabit: deleteUserHabit,
  deleteUserProgress: deleteUserProgress,
  getAll: getAll,
  storeUserProgress: storeUserProgress,
  storeUserJournal: storeUserJournal,
  getUserJournalForDate: getUserJournalForDate
}
