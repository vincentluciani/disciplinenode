const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
  userId:{
      type:String,
      required: true  
    },
  journalDate:{
    type:String,
    required: true  
  },
  journalDateISO:{
    type:Date,
    required: true  
  },
  text:{
    type:String,
    required: true  
  }
})

mongoose.model('journal',JournalSchema);
