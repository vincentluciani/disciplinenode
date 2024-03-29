const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const authenticationManager = require('../utils/authenticationManager.js')
const {cypherText,decypherText} = require('../utils/cypheringManager')

router.post('/get',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.authentication.applicationUserId},response,request);
})

router.post('/delete',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.deleteUserHabit,{userId:request.authentication.applicationUserId,id:request.body.id},response,request);
}
) 

router.post('/getall',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.getAll,{userId:request.authentication.applicationUserId,progressDateTime:request.body.requestDateTime},response,request);
})

router.post('/getalltoday',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.getAllToday,{userId:request.authentication.applicationUserId,progressDateTime:request.body.requestDateTime},response,request);
})

router.post('/add',authenticationManager.verificationManager, (request, response)=>{

    const encryptedHabitDescription = cypherText(request.body.habitDescription,request.configuration['cypheringKey'])

    const habit = {
        userId: request.authentication.applicationUserId,
        habitId: request.body.habitId,
        habitDescription: encryptedHabitDescription,
        weekDay: request.body.weekDay,
        isCritical: request.body.isCritical,
        isSuspendableDuringOtherCases: request.body.isSuspendableDuringOtherCases,
        isSuspendableDuringSickness: request.body.isSuspendableDuringSickness,
        isTimerNecessary: request.body.isTimerNecessary,
        order: request.body.order,
        target: request.body.target,
        timerInitialNumberOfMinutes: request.body.timerInitialNumberOfMinutes,
        weekDay: request.body.weekDay,
        whatUpdated: request.body.whatUpdated,
        whenUpdated: request.body.whenUpdated,
        whatCreated: request.body.whatCreated?request.body.whatCreated:'',
        whenCreated: request.body.whenCreated?request.body.whenCreated:''
    }
    common.callServiceAndAnswer(HabitsService.storeUserHabit,habit,response,request);

});

router.post('/deleteaccount',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.deleteFullAccount,{userId:request.authentication.applicationUserId,progressDateTime:request.body.requestDateTime},response,request);
});

module.exports = router;