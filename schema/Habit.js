const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
    userId:{
        type:String,
        required: true  
      },
    id:{
        type:Number,
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
      }

})

mongoose.model('habits',HabitSchema);
