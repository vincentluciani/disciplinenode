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

JournalSchema.index({ userId: 1, journalDate: 1 }, { unique: true })

mongoose.model('journal',JournalSchema);
