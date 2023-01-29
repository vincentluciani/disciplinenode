const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')

const postReceiver = require('../utils/postReceiver.js')
const authenticationManager = require('../utils/authenticationManager.js')


router.get('/:userId',(request,response)=>{

    common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.params.userId},response,request);
}
)  

router.post('/add', function(request, response){

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
    /* TODO better error handling - cannot see any error
    TODO it seems getting the body does not require any middleware? */
    common.callServiceAndAnswer(HabitsService.storeUserHabit,habit,response,request);

});

/* TODO this must be on the root and not in habit, also it must be in common places*/
// router.post('/auth', postReceiver, authenticationManager.authorizationManager, function(request, response){



// });


module.exports = router;