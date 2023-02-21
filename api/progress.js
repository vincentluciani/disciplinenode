const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const authenticationManager = require('../utils/authenticationManager.js')

router.post('/get',(request,response)=>{
    common.callServiceAndAnswer(HabitsService.getUserProgressArray,{userId:request.authentication.applicationUserId,date:request.query.date},response,request);
})  

router.post('/delete',authenticationManager.verificationManager,(request,response)=>{
    common.callServiceAndAnswer(HabitsService.deleteUserProgress,{userId:request.authentication.applicationUserId,id:request.body.id},response,request);
})  

router.post('/add',authenticationManager.verificationManager,  function(request, response){

    const isoDate = request.body.progressDate+"T00:00:00.000Z"

    const progress = {
        progressId: request.body.progressId,
        habitId: request.body.habitId,
        userId: request.authentication.applicationUserId,
        habitDescription: request.body.habitDescription,
        isCritical: request.body.isCritical,
        isSuspendableDuringOtherCases: request.body.isSuspendableDuringOtherCases,
        isSuspendableDuringSickness: request.body.isSuspendableDuringSickness,
        isTimerNecessary: request.body.isTimerNecessary,
        order: request.body.order,
        target: request.body.target,
        timerInitialNumberOfMinutes: request.body.timerInitialNumberOfMinutes,
        weekDay: request.body.weekDay,
        progressDateISO:isoDate,
        progressDate: request.body.progressDate,
        numberOfCompletions: request.body.numberOfCompletions
    }
    common.callServiceAndAnswer(HabitsService.storeUserProgress,progress,response,request);
});

module.exports = router;