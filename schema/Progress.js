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
  status:{
    type:String,
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
    progressDateISO:{
      type:Date,
      required: true  
    },
    numberOfCompletions:{
      type:Number,
      required: true  
    },
    whatUpdated:{
      type:String,
      required: false  
    },
    whatCreated:{
      type:String,
      required: false  
    },
    whenUpdated:{
      type:String,
      required: false  
    },
    whenCreated:{
      type:String,
      required: false  
    }
})

mongoose.model('progress',ProgressSchema);
