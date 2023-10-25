const express = require('express')
const router = express.Router()
const HabitsService = require('../services/HabitsService')
const common = require('../utils/requestManager')
const authenticationManager = require('../utils/authenticationManager.js')
const {cypherText,decypherText} = require('../utils/cypheringManager')

router.post('/get',authenticationManager.verificationManager,(request,response)=>{
    common.callServiceAndAnswer(HabitsService.getUserJournalForDate,{userId:request.authentication.applicationUserId,requestDate:request.body.requestDate},response,request);
})  

router.post('/add',authenticationManager.verificationManager,  function(request, response){

    const encryptedJournalEntry = cypherText(request.body.text,request.configuration['cypheringKey'])

    const isoDate = request.body.journalDate+"T00:00:00.000Z"

    const journalEntry = {
        userId: request.authentication.applicationUserId,
        journalDateISO:isoDate,
        journalDate: request.body.journalDate,
        text: encryptedJournalEntry
    }

    common.callServiceAndAnswer(HabitsService.storeUserJournal,journalEntry,response,request);

})

module.exports = router;