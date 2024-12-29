const mongoose = require('mongoose');
const logManager = require('./utils/logManager.js');
const configManager = require('./utils/configManager.js')
require('./utils/User');
require('./schema/UserCount.js');
require('./schema/Progress');
// Batch size for processing users
const BATCH_SIZE = 1000;

  
/* to run in prod: NODE_ENV=production node calculateTotals.js  */

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

/**
 * Calculate the number of days where all habits met their targets for a user,
 * and find the latest date processed.
 * @param {Collection} habitsCollection - The MongoDB habits collection
 * @param {String} userId - The user ID
 * @param {Date} countingLastDay - The date after which to calculate results
 */
async function calculateDaysWithAllTargetsMetAndLastDate(
  progressModel,
  userId,
  countingLastDay
) {

  const todaysDate = new Date();

  const result = await progressModel
    .aggregate([
      {
        $match: {
          userId: userId,
          progressDateISO: { $gt: countingLastDay, $lt: todaysDate },
        },
      },
      {
        $group: {
          _id: "$progressDateISO",
          allHabitsMet: {
            $sum: {
              $cond: [{ $gte: ["$numberOfCompletions", "$target"] }, 1, 0],
            },
          },
          totalHabits: { $sum: 1 },
        },
      },
      {
        $match: {
          $expr: { $eq: ["$allHabitsMet", "$totalHabits"] },
        },
      },
      {
        $sort: { _id: 1 }, // Ensure results are sorted by date
      },
    ])
    .exec();

  // Extract the number of days and the last date processed
  const daysWithAllTargetsMet = result.length;
  const lastProcessedDateFullDays = result.length > 0 ? result[result.length - 1]._id : countingLastDay;

  return { daysWithAllTargetsMet, lastProcessedDateFullDays };
}

async function calculateNumberOfXPAndLastDate(
    progressModel,
    userId,
    countingLastDay
  ) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Subtract one day from today to get yesterday


    // Subtract one day from today
    today.setDate(today.getDate() - 1);

    const result = await progressModel
      .aggregate([
        {
          $match: {
            userId: userId,
            progressDateISO: { $gt: countingLastDay,$lt: today },
          },
        },
        {
          $group: {
            _id: "$userId",
            habitsMet: {
              $sum: {
                $cond: [{ $gte: ["$numberOfCompletions", "$target"] }, 1, 0],
              },
            },
            totalHabits: { $sum: 1 }
        },
        },
        {
          $sort: { _id: 1 }
        },
      ])
      .exec();
  
    // Extract the number of days and the last date processed
    if (null != result && result.length > 0){
        const numberOfTargetsMet = result[0].habitsMet;
        const totalTargets = result[0].totalHabits;
        const newCountingLastDay = yesterday;
        return { 
            "totalTargets":totalTargets, 
            "numberOfTargetsMet":numberOfTargetsMet, 
            "newCountingLastDay":newCountingLastDay
        }

    } else {
        const numberOfTargetsMet = 0;
        const totalTargets=0;
        const newCountingLastDay = countingLastDay;
        return { 
            "totalTargets":totalTargets, 
            "numberOfTargetsMet":numberOfTargetsMet, 
            "newCountingLastDay":newCountingLastDay
        }
    }
    
}

async function calculateMonthlyAchievementsPerHabit(habitsCollection, userId, lastMonthCalculated)
   {
    const startDate = lastMonthCalculated || new Date("1970-01-01");
    const endDate = new Date(); // Current date
  
    const results = await habitsCollection
      .aggregate([
        {
          $match: {
            userid: userId,
            progressDateISO: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $addFields: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Extract month (YYYY-MM format)
          },
        },
        {
          $group: {
            _id: { habitid: "$habitid", month: "$month" },
            numberOfAchievedTargets: {
              $sum: { $cond: [{ $gte: ["$numberOfCompletions", "$target"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            habitid: "$_id.habitId",
            month: "$_id.month",
            numberOfAchievedTargets: 1,
          },
        },
      ])
      .exec();
  
    return results;
  
  }
  

/**
 * Process a single user
 * @param {Collection} habitsCollection - The MongoDB habits collection
 * @param {Collection} usersCollection - The MongoDB users collection
 * @param {Object} user - The user document
 */
async function processUser(progressModel, usersModel, userCountsModel, user) {

  var daysWithAllTargetsCountingLastDay; 
  var monthlyAchievementCountingLastDay; 
  var xpCountingLastDay; 

  const userCounter = await userCountsModel.findOne(
    {
        'userId':user.id
    }
  ).exec();
  
  if (null != userCounter && null != userCounter.daysWithAllTargetsMet) {
    daysWithAllTargetsCountingLastDay = userCounter.daysWithAllTargetsMet.countingLastDay || new Date("1970-01-01");
  } else {
    daysWithAllTargetsCountingLastDay = new Date("1970-01-01");
  }
    
  console.log(`Full days last counting day: ${daysWithAllTargetsCountingLastDay}`);
//   if (null != user.monthlyAchievementPerHabit) {
//     monthlyAchievementCountingLastDay = user.monthlyAchievementPerHabit.countingLastDay || new Date("1970-01-01");
//   } else {
//     monthlyAchievementCountingLastDay = new Date("1970-01-01");
//   }

  if (null != userCounter && null != userCounter.xpCounting) {
    xpCountingLastDay = userCounter.xpCounting.countingLastDay || new Date("1970-01-01");
  } else {
    xpCountingLastDay = new Date("1970-01-01");
  }
  console.log(`XP last counting day: ${xpCountingLastDay}`);
  // Calculate days with all targets met and the last processed date
  const { daysWithAllTargetsMet, lastProcessedDateFullDays } =
    await calculateDaysWithAllTargetsMetAndLastDate(
        progressModel,
        user.id,
        daysWithAllTargetsCountingLastDay
    );
    const xpResultsObject = 
    await calculateNumberOfXPAndLastDate(
        progressModel,
        user.id,
        xpCountingLastDay
    );
//   const monthlyResultsPerHabits = await calculateMonthlyAchievementsPerHabit(
//     progressModel,
//     user.id,
//     monthlyAchievementCountingLastDay)

  // Update user's lastProcessedDate
if (null!=daysWithAllTargetsMet && daysWithAllTargetsMet > 0 && null!= lastProcessedDateFullDays){
        await userCountsModel.updateOne(
            { userId: user.id  }, // Match by userId
            { 
            $set: { "daysWithAllTargetsMet.countingLastDay": lastProcessedDateFullDays}, // Always update the last processed date
            $inc: { "daysWithAllTargetsMet.count": daysWithAllTargetsMet
            }, // Increment count if it exists
            },
            { upsert: true } // Create a new document if no match is found
        );
        console.log(
            `Processed User: ${user.id}, Days Met Target (increment): ${daysWithAllTargetsMet}, Last Processed Date: ${lastProcessedDateFullDays}`
          );
}
if (null!= xpResultsObject && null!=xpResultsObject.numberOfTargetsMet && xpResultsObject.numberOfTargetsMet > 0 && null != xpResultsObject.newCountingLastDay){

  await userCountsModel.updateOne(
    { userId: user.id  }, // Match by userId
    { 
      $set: { 
       "xpCounting.countingLastDay": xpResultsObject.newCountingLastDay}, // Always update the last processed date
      $inc: { 
        "xpCounting.count": xpResultsObject.numberOfTargetsMet,
        "xpCounting.outOf": xpResultsObject.totalTargets
       }, // Increment count if it exists
    },
    { upsert: true } // Create a new document if no match is found
  );
  console.log(
    `Processed User: ${user.id}, Number of XP (increment): ${xpResultsObject.numberOfTargetsMet} out of ${xpResultsObject.totalTargets} , Last Processed Date: ${xpResultsObject.newCountingLastDay}`
  );
}

  
  
}

/**
 * Process users in batches
 */
async function processUsersInBatches(mongoose) {
  /*const { client, db } = await connectToDatabase();*/
  try {
    const usersModel = mongoose.model('users')
    const progressModel = mongoose.model('progress')
    const userCountsModel = mongoose.model('usercounts')
    let hasMoreUsers = true;
    let lastUserId = null;

    try{
      const progressArray = await progressModel.find({}).exec();
    } catch(e){
      console.error(e)
    }
    const userArray = await usersModel.find({}).exec();
    const userCountsArray = await userCountsModel.find({}).exec();

    while (hasMoreUsers) {
      const users = await fetchUserBatch(usersModel, lastUserId);
      console.log(`Number of users found: ${users.length}`);
      if (users.length === 0) {
        hasMoreUsers = false;
        break;
      }

      for (const user of users) {
        await processUser(progressModel, usersModel, userCountsModel, user);
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

const configuration = configManager.getApplicationConfiguration();

var lm = new logManager(configuration.logDirectory);
lm.logger.info("Environment:"+process.env.NODE_ENV)

mongoose.connect(configuration.database,{ useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
.then(async()=> {
        console.log('Mongodb connected')
        lm.logger.info("Mongodb connected")
        await processUsersInBatches(mongoose);
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



// Run the batch processing function
