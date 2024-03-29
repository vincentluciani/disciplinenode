const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const authenticationManager = require('../utils/authenticationManager.js')
const {cypherText,decypherText} = require('../utils/cypheringManager')
router.post('/get',(request,response)=>{
    common.callServiceAndAnswer(HabitsService.getUserProgressArray,{userId:request.authentication.applicationUserId,date:request.query.date},response,request);
})  

router.post('/delete',authenticationManager.verificationManager,(request,response)=>{
    common.callServiceAndAnswer(HabitsService.deleteUserProgress,{userId:request.authentication.applicationUserId,id:request.body.id},response,request);
})  

router.post('/add',authenticationManager.verificationManager,  function(request, response){

    const isoDate = request.body.progressDate+"T00:00:00.000Z"

    const encryptedHabitDescription = cypherText(request.body.habitDescription,request.configuration['cypheringKey'])

    const progress = {
        progressId: request.body.progressId,
        habitId: request.body.habitId,
        userId: request.authentication.applicationUserId,
        habitDescription: encryptedHabitDescription,
        isCritical: request.body.isCritical,
        isSuspendableDuringOtherCases: request.body.isSuspendableDuringOtherCases,
        isSuspendableDuringSickness: request.body.isSuspendableDuringSickness,
        isTimerNecessary: request.body.isTimerNecessary,
        status: request.body.status,
        order: request.body.order,
        target: request.body.target,
        timerInitialNumberOfMinutes: request.body.timerInitialNumberOfMinutes,
        weekDay: request.body.weekDay,
        progressDateISO:isoDate,
        progressDate: request.body.progressDate,
        numberOfCompletions: request.body.numberOfCompletions,
        whatUpdated: request.body.whatUpdated,
        whenUpdated: request.body.whenUpdated,
        whatCreated: request.body.whatCreated?request.body.whatCreated:'',
        whenCreated: request.body.whenCreated?request.body.whenCreated:''
    }
    common.callServiceAndAnswer(HabitsService.storeUserProgress,progress,response,request);
});

module.exports = router;