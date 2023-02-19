const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')

const postReceiver = require('../utils/postReceiver.js')
const authenticationManager = require('../utils/authenticationManager.js')


// router.get('/:userId',(request,response)=>{

//     common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.params.userId},response,request);
// }
// )  

router.post('/get',authenticationManager.verificationManager,(request,response)=>{
  /* todo:
  can do middleware for output first*/
  common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.authentication.applicationUserId},response,request);

})

router.post('/delete',authenticationManager.verificationManager,(request,response)=>{
  common.callServiceAndAnswer(HabitsService.deleteUserHabit,{userId:request.authentication.applicationUserId,id:request.body.id},response,request);
}
) 

router.post('/getall',authenticationManager.verificationManager,(request,response)=>{
  /* todo:
  dataArrays.todaysProgressArray
  dataArrays.progressArray 
  dataArrays.habitsArray
  can do middleware for output first*/
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
    /* TODO better error handling - cannot see any error
    TODO it seems getting the body does not require any middleware?
    TODO: user id should come from middleware
    TODO: need to get back the id of the habit */
    common.callServiceAndAnswer(HabitsService.storeUserHabit,habit,response,request);

});

module.exports = router;