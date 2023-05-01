const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
    userId:{
        type:String,
        required: true  
      },
    habitId:{
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

HabitSchema.index({ user: 1, habitId: 1 }, { unique: true })

mongoose.model('habits',HabitSchema);
