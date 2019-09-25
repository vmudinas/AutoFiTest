
module.exports = {
    CreateCollection: async function (dbo, collName) {
        //var collName = "providers";

        const collections = await dbo.collections();
        if (!collections.map(c => c.s.name).includes(collName)) {
            console.log("Creating  Collection");
            await dbo.createCollection(collName);
        }
        else {
            console.log("Collection exist");
            dbo.collection.remove();
            await dbo.createCollection(collName);
        }     

    },
    FindOneByName: async function (dbo, collName, providerName) {
      return  await dbo.collection(collName).findOne({ Name: providerName });
    },
    Find: async function (dbo, collName, providerName) {
        return await dbo.collection(collName).find({ Name: providerName });
    },
    InsertValues: async function (dbo, collName, array) {
        await dbo.collection(collName).insertOne(array);
    },
    CreateProviderSettingData: async function (dbo, collName) {
        await CreaterDummyProviders(dbo, collName);   
    }
};

async function CreaterDummyProviders(dbo, collName) {
    await dbo.collection(collName).insertOne({ UUID: 0, VIN: 1, Make: 2, Model: 3, Mileage: 4, Year: 5, Price: 6, 'Zip Code': 7, 'Create Date': 8, 'Update Date': 9, Name: "TestProviderA" });
    await dbo.collection(collName).insertOne({ UUID: 2, VIN: 3, Make: 1, Model: 4, Mileage: 5, Year: 6, Price: 7, 'Zip Code': 8, 'Create Date': 6, 'Update Date': 9, Name: "TestProviderB" });
    await dbo.collection(collName).insertOne({ UUID: 3, VIN: 4, Make: 1, Model: 2, Mileage: 5, Year: 6, Price: 8, 'Zip Code': 7, 'Create Date': 8, 'Update Date': 9, Name: "TestProviderC" });
    await dbo.collection(collName).insertOne({ UUID: 4, VIN: 5, Make: 1, Model: 2, Mileage: 3, Year: 6, Price: 8, 'Zip Code': 7, 'Create Date': 9, 'Update Date': 8, Name: "TestProciderD" });
}