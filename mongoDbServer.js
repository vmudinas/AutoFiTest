const mongoServer = require('mongodb-memory-server');
var MongoClient = require('mongodb').MongoClient;
const mongod = new mongoServer.MongoMemoryServer();

mongod.opts.autoStart = true;
let dbConn;

module.exports = {
    Init: async function () {
        dbConn = await CreateDbClient();
    },
    ReturnDb: async function () {
        return await dbConn;
    },
    CloseDbConn: async function () {
        await dbConn.close();
    }
};

async function CreateDbClient() {

    var mongo_uri = await mongod.getUri();
    var dbName = await mongod.getDbName();

   return MongoClient
        .connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client => {
            return client.db(dbName);
        })
        .catch(error => console.error(error));
}

