const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const authenticationManager = require('../utils/authenticationManager.js')

router.post('/get',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.authentication.applicationUserId},response,request);
})

router.post('/delete',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.deleteUserHabit,{userId:request.authentication.applicationUserId,id:request.body.id},response,request);
}
) 

router.post('/getall',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.getAll,{userId:request.authentication.applicationUserId,progressDate:request.body.requestDate},response,request);
})

router.post('/add',authenticationManager.verificationManager, (request, response)=>{

    const habit = {
        userId: request.authentication.applicationUserId,
        habitId: request.body.habitId,
        habitDescription: request.body.habitDescription,
        weekDay: request.body.weekDay,
        isCritical: request.body.isCritical,
        isSuspendableDuringOtherCases: request.body.isSuspendableDuringOtherCases,
        isSuspendableDuringSickness: request.body.isSuspendableDuringSickness,
        isTimerNecessary: request.body.isTimerNecessary,
        order: request.body.order,
        target: request.body.target,
        timerInitialNumberOfMinutes: request.body.timerInitialNumberOfMinutes,
        weekDay: request.body.weekDay
    }
    common.callServiceAndAnswer(HabitsService.storeUserHabit,habit,response,request);

});

module.exports = router;