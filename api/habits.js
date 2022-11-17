const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')

router.get('/:userId',(request,response)=>{

    common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.params.userId},response,request);
}
)  

router.post('/', function(request, response){

    const habit = {
        userId: request.body.userId,
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