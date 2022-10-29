const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
    userId:{
        type:Number,
        required: true  
      },
    habitDescription:{
      type:String,
      required: true  
    },
    weekDay:{
        type:String,
        required: true  
      }
})

mongoose.model('habits',HabitSchema);
