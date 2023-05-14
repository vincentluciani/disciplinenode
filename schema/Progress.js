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
      required: false  
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
      type:Date,
      required: false  
    },
    whenCreated:{
      type:Date,
      required: false  
    }
})

ProgressSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true })

mongoose.model('progress',ProgressSchema);
