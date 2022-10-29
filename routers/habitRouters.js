const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var qs = require('querystring');
require('../schema/Habit');
const Habit = mongoose.model('habits'); 



router.get('/:userId',(req,res)=>{

    let habitsArray = [];
    Habit.find({userId:req.params.userId})
    /*.sort({date:'desc'})
    .lean()*/
    .then(habitObject => {
       habitsArray.push(habitObject);
    } ).
    then( ()=>{
        let result = {"result":habitsArray};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });

   
}
)  


router.post('/', function(request, response){
    console.log(request.body.habitDescription);     
    console.log(request.body.weekDay);
    response.send(request.body);    // echo the result back

    const habit = new Habit({
        userId: request.body.userId,
        habitDescription: request.body.habitDescription,
        weekDay: request.body.weekDay
    })
    habit.save().then(savedDoc => {
        savedDoc === habit; // true
      });

  });



module.exports = router;