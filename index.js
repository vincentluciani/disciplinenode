const nodeMongo = require('./utils/nodeMongoServerInitializer')
const habitRouters= require('./api/habits');
const progressRouters= require('./api/progress');
const journalRouters= require('./api/journal');
const testRouters= require('./api/test');

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
    },
    {
        path: '/test',
        router: testRouters
    }
]

nodeMongo.initializeServer(routers)




