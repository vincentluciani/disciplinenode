const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const {OAuth2Client} = require('google-auth-library');
const configManager = require('../utils/configManager.js')

const configuration = configManager.getApplicationConfiguration();

const client = new OAuth2Client(configuration.clientId);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: configuration.clientId,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return payload;
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}



router.get('/:userId',(request,response)=>{

    common.callServiceAndAnswer(HabitsService.getUserHabits,{userId:request.params.userId},response,request);
}
)  

router.post('/', function(request, response){

    const habit = {
        userId: request.body.userId,
        habitDescription: request.body.habitDescription,
        weekDay: request.body.weekDay,
        isCritical: request.body.isCritical,
        isSuspendableDuringOtherCases: request.body.isSuspendableDuringOtherCases,
        isSuspendableDuringSickness: request.body.isSuspendableDuringSickness,
        isTimerNecessary: request.body.isTimerNecessary,
        order: request.body.order,
        target: request.body.target,
        timerInitialNumberOfMinutes: request.body.timerInitialNumberOfMinutes,
        weekDay: request.body.weekDay
    }

    common.callServiceAndAnswer(HabitsService.storeUserHabit,habit,response,request);

});


router.post('/auth', function(request, response){

    var body = ''
    request.on('data', function(data) {
      body += data
      console.log('Partial body: ' + body)
    })
    request.on('end', function() {
      console.log('Body: ' + body)

      const token=body.replace(/token=(\w*)/,'$1');
      verify(token).then(
        value => {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.end(value.picture)
        },
        reason => {
            console.log(reason)
        }
      )
      
      
    })
});


module.exports = router;