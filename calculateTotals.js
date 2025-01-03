const mongoose = require('mongoose');
require('./schema/UserCount.js');
require('./schema/Progress');
const batch = require('./utils/processUserBatch')
  
/* to run in prod: NODE_ENV=production node calculateTotals.js  */


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
async function processUser(user,configuration,logger) {

  var daysWithAllTargetsCountingLastDay; 
  var monthlyAchievementCountingLastDay; 
  var xpCountingLastDay; 

  var userCountsModel = mongoose.model('usercounts')
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

  var progressModel = mongoose.model('progress')
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


try{
   
  batch.processBatches(mongoose,processUser);
  
} 
catch (error) {
  console.error("Error during batch processing:", error);
} 
// Run the batch processing function
