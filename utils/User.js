const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userGoogleId:{
    type:Number,
    required: true  
  },
  userType:{
    type:String,
    required: true  
  }

})

mongoose.model('users',UserSchema);
