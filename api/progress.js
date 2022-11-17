const express = require('express')
const router = express.Router()
const ProgressService = require('../services/ProgressService')
const common = require('../utils/requestManager')

router.get('/:userId',(request,response)=>{
/*date*/
    common.callServiceAndAnswer(ProgressService.getUserProgressForDate,{userId:request.params.userId,date:request.query.date},response,request);
}
)  

router.post('/', function(request, response){

    const progress = {
       /*
      habitDescription
      habitId
      id
      isCritical
      isNew 
      isSuspendableDuringOtherCases
      isSuspendableDuringSickness
      isTimerNecessary
      numberOfCompletions
      order
      progressDate
      target
      timerInitialNumberOfMinutes
       */
    }

    common.callServiceAndAnswer(HabitsService.storeUserProgress,progress,response,request);

});



module.exports = router;