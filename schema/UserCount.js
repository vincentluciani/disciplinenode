const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCountSchema = new Schema({
  userId:{
    type:String,
    required: true  
  },
  daysWithAllTargetsMet: {
    countingLastDay: {
        type:   Date,
        required: false
    },
    count: {
        type:   Number,
        required: false
    }
  },
  xpCounting:{
    countingLastDay:{
      type:   Date,
      required: false
    },
    count: {
      type:   Number,
      required: false
    },
    outOf: {
      type:   Number,
      required: false
    }
  }  
} 

)

mongoose.model('usercounts',UserCountSchema);
