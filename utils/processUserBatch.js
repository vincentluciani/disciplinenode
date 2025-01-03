const mongoose = require('mongoose');
const logManager = require('./logManager.js');
const configManager = require('./configManager.js')
require('./User');

// Batch size for processing users
const BATCH_SIZE = 1000;

/* to run in prod: NODE_ENV=production node calculateTotals.js  */

async function processUsersInBatches(mongoose,processingFunction,configuration,logger) {

    
    /*const { client, db } = await connectToDatabase();*/
    try {
      const usersModel = mongoose.model('users')
      let hasMoreUsers = true;
      let lastUserId = null;
  
      while (hasMoreUsers) {
        const users = await fetchUserBatch(usersModel,lastUserId);
        console.log(`Number of users found: ${users.length}`);
        if (users.length === 0) {
          hasMoreUsers = false;
          break;
        }
  
        for (const user of users) {
            // TODO CHANGE PROCESSUSER TO USE A USER MODEL OBJECT
          await processingFunction(user, configuration, logger);
        }
  
        // Update lastUserId for pagination
        lastUserId = users[users.length - 1]._id;
      }
  
      console.log("Batch processing completed.");
    } catch (error) {
      console.error("Error during batch processing:", error);
    } /*finally {
      await client.close();
    }*/
  }

async function fetchUserBatch(usersModel, lastUserId) {
    const query = lastUserId ? { _id: { $gt: lastUserId } } : {};
  
   // try{
      const result = await usersModel.find(query).sort({ _id: 1 }).limit(BATCH_SIZE).exec();
      return result;
    // } catch (e){
    //   console.error(e);
    //   return [];
    // }
    
  }




const processBatches = (mongoose,processingFunction) => {
    const configuration = configManager.getApplicationConfiguration();
    var lm = new logManager(configuration.logDirectory);
    lm.logger.info("Environment:"+process.env.NODE_ENV)

    mongoose.connect(configuration.database,{ useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
    .then(async()=> {
            console.log('Mongodb connected')
            lm.logger.info("Mongodb connected")
            await processUsersInBatches(mongoose,processingFunction,configuration,lm.logger);
            console.log('Process ended');
            await mongoose.connection.close();
            process.exit(0); 
        }
        )
    .catch(err => {
    console.log(err)
    process.exit(1);
    }
    );
}


module.exports = {
    processBatches: processBatches
}
     