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
  progressId:{
    type:String,
    required: true  
  },
  habitId:{
    type:String,
    required: true  
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
    required: false  
  },
  isSuspendableDuringOtherCases:{
    type:Boolean,
    required: false  
  },
  isSuspendableDuringSickness:{
    type:Boolean,
    required: false  
  },
  isTimerNecessary:{
    type:Boolean,
    required: false  
  },
  order:{
    type:Number,
    required: false  
  },
  target:{
    type:Number,
    required: true  
  },
  timerInitialNumberOfMinutes:{
    type:Number,
    required: false  
  },
  weekDay:{
      type:String,
      required: true  
    },
    progressDate:{
      type:String,
      required: true  
    },
    progressDateISO:{
      type:Date,
      required: true  
    },
    numberOfCompletions:{
      type:String,
      required: true  
    }

})

mongoose.model('progress',ProgressSchema);
