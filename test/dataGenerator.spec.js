var assert = require('assert');
const mongoServer = require('../mongoDbServer');
const dataGen = require('../dataGenerator');
var db;

beforeEach(async function () {
    await mongoServer.Init();
    db = await mongoServer.ReturnDb();
});

describe('mongoServer.Init', function () {

  
    it('#get db', async () => {    
        assert.equal(0, db._eventsCount);
    }); 

    it('#test setting generation and  find by name and setting order for TestProciderA', async () => {
     
        await dataGen.CreateProviderSettingData(db, "collection");
        var setting = await dataGen.FindOneByName(db, "collection", "TestProviderA");
        assert.equal(9, setting['Update Date']);
    });  

    it('#test setting order for TestProciderD', async () => {

        await dataGen.CreateProviderSettingData(db, "collection");
        var setting = await dataGen.FindOneByName(db, "collection", "TestProciderD");
        assert.equal(8, setting['Update Date']);
    });   
});

