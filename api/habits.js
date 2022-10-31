const express = require('express');
const router = express.Router();
const HabitsService = require('../services/HabitsService')


router.get('/:userId',(request,response)=>{

    callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.params.userId},response);
}
)  

router.post('/', function(request, response){

    const habit = {
        userId: request.body.userId,
        habitDescription: request.body.habitDescription,
        weekDay: request.body.weekDay
    }

    callServiceAndAnswer(HabitsService.storeUserHabit,habit,response);

});

const callServiceAndAnswer = (serviceFunction,inputObject,response) => {
serviceFunction(inputObject).
then(value => {
    let result = {"result":value};
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(result));
    console.log(value);
    }, reason => {
    console.log(reason );
    /* todo give back 500 with no reason, just log the reason */
    })
}

module.exports = router;