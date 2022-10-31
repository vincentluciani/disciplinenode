const nodeMongo = require('./utils/nodeMongoServerInitializer')
const habitRouters= require('./api/habits');
const progressRouters= require('./api/progress');

const routers = [
    {
        path: '/habits',
        router:habitRouters
    },
    {
        path: '/progress',
        router: progressRouters
    }
]

nodeMongo.initializeServer(routers)





