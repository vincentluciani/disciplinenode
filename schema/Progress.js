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

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressSchema = new Schema({
  id:{
    type:String,
    required: false  
  },
  userId:{
    type:String,
    required: true  
  },
  habitDescription:{
    type:String,
    required: true  
  },
  isCritical:{
    type:Boolean,
    required: true  
  },
  isSuspendableDuringOtherCases:{
    type:Boolean,
    required: true  
  },
  isSuspendableDuringSickness:{
    type:Boolean,
    required: true  
  },
  isTimerNecessary:{
    type:Boolean,
    required: true  
  },
  order:{
    type:Number,
    required: true  
  },
  target:{
    type:Number,
    required: true  
  },
  timerInitialNumberOfMinutes:{
    type:Number,
    required: true  
  },
  weekDay:{
      type:String,
      required: true  
    },
    progressDate:{
      type:String,
      required: true  
    },
    numberOfCompletions:{
      type:String,
      required: true  
    }

})

mongoose.model('progress',ProgressSchema);
