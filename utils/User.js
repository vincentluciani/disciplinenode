const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userGoogleId:{
    type:String,
    required: true  
  },
  userType:{
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

mongoose.model('users',UserSchema);
