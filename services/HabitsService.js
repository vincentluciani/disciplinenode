
require('../schema/Habit')
require('../schema/Progress')
require('../schema/Journal')
require('../utils/User')

const {formatDate, toDateTime} = require('../utils/dateFormatting')
const { query } = require('express');
const {cypherText,decypherText} = require('../utils/cypheringManager')

const mongoose = require('mongoose')
const habitsModel = mongoose.model('habits')

const progressModel = mongoose.model('progress')
const journalModel = mongoose.model('journal')

const userModel = mongoose.model('users')

const getUserHabits = async (queryObject) => {
  return await habitsModel.find({userId:queryObject.userId})
      /*.sort({date:'desc'})
.lean()*/
}

const getAllToday = async (queryObject,logger,cypheringKey) => {
  var resultObject = {}

  resultObject.todaysProgressArray = await getUserProgressForDate(queryObject,cypheringKey)
  resultObject.habitsArray =  await getHabitsArray(queryObject.userId,cypheringKey)
  /* completeTodayProgress can fail in case another instance of the client sends the request at the exact same time
  In that case, you need to get the progresses again to get the processes created successfully by the other client */
  try {
  resultObject.todaysProgressArray = await completeTodayProgress(resultObject.todaysProgressArray,resultObject.habitsArray,queryObject.progressDateTime,cypheringKey)
  } catch(e){
    resultObject.todaysProgressArray = await getUserProgressForDate(queryObject,cypheringKey)
  }
  resultObject.journalArray = await getUserJournalToday(queryObject,queryObject.progressDateTime,cypheringKey)
  return resultObject
}
const getHabitsArray = async (id,cypheringKey) =>{

  let habitsArray = await habitsModel.find({userId:id})

  for (let habitElement of habitsArray){
    habitElement.habitDescription = decypherText(habitElement.habitDescription,cypheringKey)
  }

  return habitsArray
}

const getAll = async (queryObject,logger,cypheringKey) => {
  var resultObject = {}

  resultObject.journalArray = await getUserJournal(queryObject,cypheringKey)
  // resultObject.progressArray=await getAllUserProgress(queryObject)
  // resultObject.todaysProgressArray = await getUserProgressForDate(queryObject)
  // // resultObject.habitsArray =  await habitsModel.find({userId:queryObject.userId})
  resultObject.pastProgressArray = await getUserProgressBeforeDate(queryObject,cypheringKey)


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

const deleteProgresses = async (queryObject,logger) => {
  return await progressModel.deleteMany({userId:queryObject.userId})
  /* check if what is returned is what was given */
}
const deleteHabits = async (queryObject,logger) => {
  return await habitsModel.deleteMany({userId:queryObject.userId})
  /* check if what is returned is what was given */
}

const deleteUser = async (queryObject,logger) => {
  return await userModel.deleteOne({_id:queryObject.userId})
  /* check if what is returned is what was given */
} 

const deleteFullAccount = async (queryObject,logger) => {
  var result = await deleteProgresses(queryObject,logger)
  result = await deleteHabits(queryObject,logger)
  return result = await deleteUser(queryObject,logger)
}


const getUserProgressForDate = async (queryObject,cypheringKey,logger) => {
  const formattedProgressDate = formatDate(queryObject.progressDateTime)
  let userProgressArray = await progressModel.find({userId:queryObject.userId,progressDate:formattedProgressDate})
  for (let progressElement of userProgressArray){
    progressElement.habitDescription = decypherText(progressElement.habitDescription,cypheringKey)
  }
  return userProgressArray
      /*.sort({date:'desc'})
.lean()*/
}

const getUserJournalForDate = async (queryObject,logger,cypheringKey) => {
  let journalArray = await journalModel.find({userId:queryObject.userId,journalDate:queryObject.requestDate})
  // for (let journalElement of journalArray){
  //   journalElement.text = decypherText(journalElement.text,cypheringKey)
  // }
  if (null!=journalArray && journalArray.length>=1){
    journalArray[0].text = decypherText(journalArray[0].text,cypheringKey)
    return journalArray[0]
  } else {
    return {}
  }

  //return journalArray[0]
  /*.sort({date:'desc'})
.lean()*/
}

const getUserJournalToday = async(queryObject,progressDateTime,cypheringKey,logger) => {
  var currentDate = formatDate(progressDateTime);
  let journalArray = await journalModel.find({userId:queryObject.userId,journalDate:currentDate})
  if (null!=journalArray && journalArray.length>=1){
    journalArray[0].text = decypherText(journalArray[0].text,cypheringKey)
    return journalArray[0]
  } else {
    return {}
  }
  // for (let journalElement of journalArray){
  //   journalElement.text = decypherText(journalElement.text,cypheringKey)
  // }
  // return journalArray[0]
}
const getUserJournal = async (queryObject,cypheringKey,logger) => {
  let journalArray = await journalModel.find({userId:queryObject.userId})
  for (let journalElement of journalArray){
      journalElement.text = decypherText(journalElement.text,cypheringKey)
  }
  return journalArray
      /*.sort({date:'desc'})
.lean()*/
}


const getUserProgressBeforeDate = async (queryObject,cypheringKey,logger) => {
  const isoDate = formatDate(queryObject.progressDateTime)+"T00:00:00.000Z"
  const oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 11);

  let progressArray = await progressModel.find({userId:queryObject.userId,progressDateISO:{
    $lt:new Date(isoDate),
    $gte: oldDate,
  }}).sort({progressDateISO:-1})
        /*.sort({date:'desc'})
  .lean()*/
  for (let progressElement of progressArray){
    progressElement.habitDescription = decypherText(progressElement.habitDescription,cypheringKey)
  }
  return progressArray

  //return result;
}

// const getAllUserProgress = async (queryObject,logger,cypheringKey) => {
//   return await progressModel.find({userId:queryObject.userId})
  
// /*.lean()*/
// }

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

const completeTodayProgress = async (progressArray,habitsArray,currentDateTime,cypheringKey) => {
  
  let newProgressArray = progressArray
  for (habit of habitsArray){
    let progressExist = false
    for (progress of progressArray){
      if (progress.habitId == habit.habitId ){
        progressExist = true
      }
    }
    if (!progressExist && isDayOfWeekInHabitWeeks(currentDateTime,habit.weekDay)){
      let newProgress = await createProgressBasedOnHabit(habit,currentDateTime,cypheringKey)
      newProgressArray.push(newProgress)
    }
  }
  return newProgressArray
}

const createProgressBasedOnHabit = async (habit,currentDateTime,cypheringKey) => {

  var currentDate = formatDate(currentDateTime);
  const encryptedHabitDescription = cypherText(habit.habitDescription,cypheringKey)

  let newProgressObject =  {
    progressId: habit.habitId + "_" + currentDate,
    habitId: habit.habitId.toString(),
    userId: habit.userId,
    habitDescription: encryptedHabitDescription,
    isCritical: habit.isCritical?habit.isCritical:false,
    isSuspendableDuringOtherCases: habit.isSuspendableDuringOtherCases?habit.isSuspendableDuringOtherCases:false,
    isSuspendableDuringSickness: habit.isSuspendableDuringSickness?habit.isSuspendableDuringSickness:false,
    isTimerNecessary: habit.isTimerNecessary?habit.isTimerNecessary:false,
    status: "active",
    order: habit.order?habit.order:80,
    target: habit.target,
    timerInitialNumberOfMinutes: habit.timerInitialNumberOfMinutes?habit.timerInitialNumberOfMinutes:0,
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
  //result = await objectToInsert.save(objectToInsert)
  result = await objectToInsert.save()

  newProgressObject.habitDescription = habit.habitDescription
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
  getUserJournalForDate: getUserJournalForDate,
  deleteFullAccount
}
