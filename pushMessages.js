


/* to initialize: npm run web-push generate-vapid-keys */

var webPush = require('web-push')
const batch = require('./utils/processUserBatch')
const mongoose = require('mongoose');
require('./utils/subscriptions/schema');

const processUser = async (user,configuration,logger) => {

    webPush.setVapidDetails('mailto:'+configuration.subscriptions.mailto,
        configuration.subscriptions.publicKey,
        configuration.subscriptions.privateKey)

    /* TODO: SHOULD INSERT MORE THAN ONE per user*/
    var userSubscriptionsModel = mongoose.model('subscriptions')
    const userSubscriptions = await userSubscriptionsModel.find(
    {
        'userId':user.id
    }
    ).exec();
      
    for (const element of userSubscriptions){
        var pushConfig={
            endpoint: element.endpoint,
            keys:{
                auth: element.keys.auth,
                p256dh: element.keys.p256dh
            }
        }
        try{
            console.log('sending message to : '+pushConfig.endpoint)
            const response = await webPush.sendNotification(pushConfig,JSON.stringify({title:'victory !',content:'This is how victory looks like!'}))
            console.log('message sent',response)
        } catch(e){
            console.error(e)
        }
    }      
}



try{
   
    batch.processBatches(mongoose,processUser);
    
  } 
  catch (error) {
    console.error("Error during batch processing:", error);
  } 

