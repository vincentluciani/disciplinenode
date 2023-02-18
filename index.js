const nodeMongo = require('./utils/nodeMongoServerInitializer')
const habitRouters= require('./api/habits');
const progressRouters= require('./api/progress');
const journalRouters= require('./api/journal');

const routers = [
    {
        path: '/habits',
        router:habitRouters
    },
    {
        path: '/progress',
        router: progressRouters
    },
    {
        path: '/journal',
        router: journalRouters
    }
]

nodeMongo.initializeServer(routers,'https')





