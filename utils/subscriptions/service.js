require('./schema')

const addSubscription = async (queryObject,logger,cypheringKey) => {
    const mongoose = require('mongoose')
    const subscriptionModel = mongoose.model('subscriptions')
    var query = {
        userId: queryObject.userId
    }
    var update = {
        userId:queryObject.userId,
        endpoint:queryObject.subscription.endpoint,
        keys:{
            auth:queryObject.subscription.keys.auth,
            p256dh:queryObject.subscription.keys.p256dh
        }
    }

    var options = { upsert: true, new: true, setDefaultsOnInsert: true };

    result = await subscriptionModel.findOneAndUpdate(query, update, options)

    console.log(queryObject)
    return {}
}

module.exports = {
    addSubscription: addSubscription,
  }