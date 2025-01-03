const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  userId:{
    type:String,
    required: true  
  },
  endpoint:{
    type:String,
    required: true  
  },
  keys:{
    auth:{
      type:String,
      required: true  
    },
    p256dh:{
      type:String,
      required: true  
    },
  }
} 

)

mongoose.model('subscriptions',SubscriptionSchema);