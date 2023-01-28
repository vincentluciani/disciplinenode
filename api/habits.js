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
    /* does not make sense to use this , this is calling an API !!!!!) */
    common.callServiceAndAnswer(HabitsService.storeUserHabit,habit,response,request);

});

/* TODO this must be on the root and not in habit, also it must be in common places*/
router.post('/auth', postReceiver, authenticationManager.authorizationManager, function(request, response){

  /* todo put final handling in a middleware */
    if (request.authentication.isAuthenticated){
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end(request.authentication.picture)
    } else {
      response.writeHead(401, {'Content-Type': 'text/html'})
      response.end("Authentication Failed")
    }

});


module.exports = router;