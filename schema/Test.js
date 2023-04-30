const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
  name:{
      type:String,
      required: true  
    },
  dateTime:{
    type:String,
    required: true  
  }
});

mongoose.model('test',testSchema);