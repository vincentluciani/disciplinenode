const express = require('express')
const router = express.Router()
const ProgressService = require('../services/ProgressService')
const common = require('../utils/requestManager')

router.post('/get',(request,response)=>{
    common.callServiceAndAnswer(ProgressService.getUserProgressForDate,{userId:request.authentication.applicationUser,date:request.query.date},response,request);
}
)  

router.post('/', function(request, response){

    const progress = {
        id: request.body.id,
        userId: request.body.userId,
        habitDescription: request.body.habitDescription,
        isCritical: request.body.isCritical,
        isSuspendableDuringOtherCases: request.body.isSuspendableDuringOtherCases,
        isSuspendableDuringSickness: request.body.isSuspendableDuringSickness,
        isTimerNecessary: request.body.isTimerNecessary,
        order: request.body.order,
        target: request.body.target,
        timerInitialNumberOfMinutes: request.body.timerInitialNumberOfMinutes,
        weekDay: request.body.weekDay,
        progressDate: request.body.progressDate,
        numberOfCompletions: request.body.numberOfCompletions
    }
/* todo: user id should come from the middleware*/
    common.callServiceAndAnswer(ProgressService.storeUserProgress,progress,response,request);

  });



module.exports = router;