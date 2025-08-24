
/*
subscription: {endpoint: 'https://fcm.googleapis.com/fcm/send/eQd4CG5d…bwxX8e5Y_awBfG2TIyX5RFlSKVLVylvgd_YElyCQINB', expirationTime: null, keys: {…}}
endpoint: 'https://fcm.googleapis.com/fcm/send/eQd4CG5dhjo:APA91bH1z6OmJbh-lILyrQ2QPouyRUoK5LW9GraLtZNQE1fFooTRQDhYEKmlyhv_ZRPo6r0cbi06FAde1a0CAaJHW9c86fblubwxX8e5Y_awBfG2TIyX5RFlSKVLVylvgd_YElyCQINB'
expirationTime: null
keys: {p256dh: 'BGPXhJtGY8PyKa-9Vp09P6X3XaqZg7kW4_lr2Dzd9rcCTKnDrf3gDIvyz7HkNFW-pvgvX-fbipJXiaWKY5oiNbA', auth: 'lt4RiSCgqKZ5M8zgi-ZDCQ'}
[[Prototype]]: Object
userId: '6557111e7424dd0bc43343ce'
[[Prototype]]: Object
*/


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


/* private and public key from the configuration */
/* endpoint and keys from the database, and encrypted */
/* upsert, so that new endpoint replaces the old endpoint (must do the action of replacement when replacing the version)*/
// var pushConfig={
//     endpoint: 'https://fcm.googleapis.com/fcm/send/f98lh1hpe1E:APA91bEVTNk3qf19-k3G_btFeI2P9pGJ8x_K221Gthjq4-XtjZA8d0cR8Mq3_Ql7ch8V1iuub7W24a6PqmTxn_ZnrjNQ74YTmzF2se2-wGDd_YnDuZVq0XZBAUiMfUqro2j4qdgomKSP',
//     keys: {
//         auth: 'RZQo9MT0YbyIUaV1JVHWtA',
//         p256dh: 'BGaIwHd3SaQHe4rfWACS1zohK27n0wYjoQJMW97yvqtZb_43dJ8fXC2usOQHst0sQr3X9IJ7-ZAlpO6aDPSfP7I'
//     }
// }
// try{
//     webPush.sendNotification(pushConfig,JSON.stringify({title:'new message',content:'new content'}))

// } catch(e){
//     console.error(e)
// }
// }

try{
   
    batch.processBatches(mongoose,processUser);
    
  } 
  catch (error) {
    console.error("Error during batch processing:", error);
  } 

