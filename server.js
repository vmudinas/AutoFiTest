const fs = require('fs');
const http = require('http');
const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const mongoServer = require('./mongoDbServer');
const dataGenerator = require('./dataGenerator');
let db;
let providerSettings;
let dataStore = "dataStore";
let dataSettingStore = "settingStore";
const app = express();

MainApi();

function MainApi() {

    var upload = multer({ dest: 'tmp/csv/' });
    
    app.use(express.json());
    app.use('/upload', upload.single('file'), function (req, res) {
        res.send('Api called successfully');

        // If we had header we wouldn't need to have configuration based on the client and we could just read columns we want   
        //fs.createReadStream(req.file.path)
        //    .pipe(csv.parse({ headers: true }))
        //    .on('data', function (dataRow) {
        //        console.log(dataRow['Start Date']);

        //        dataRow['UUID'];
        //        dataRow['VIN'];
        //        dataRow['Make'];
        //        dataRow['Model'];
        //        dataRow['Mileage'];
        //        dataRow['Year'];
        //        dataRow['Price'];
        //        dataRow['Zip Code'];
        //        dataRow['Create Date'];
        //        dataRow['Update Date'];
        //      //  console.log(dataRow.StartDate);
        //     //   console.log(dataRow.Something);
        //    })
        //    .on("error", function (data) {
        //        console.log("Catch eror on Header miss match");
        //        console.log(data);
        //        return false;
        //    });

        // Assuming header are not available and each client passes data in order of their configuration
        res.status(ReadCSVByProvider(fs, req, "TestProviderA"));

    });
}
async function InitDb() {
    await GetDb();
    await dataGenerator.CreateCollection(db, dataSettingStore);
    await dataGenerator.CreateCollection(db, dataStore);
    await dataGenerator.CreateProviderSettingData(db, dataSettingStore);
}
async function GetDb() {

    await mongoServer.Init();
    db = await mongoServer.ReturnDb();
}
async function ReadCSVByProvider(fs, req, providerName) {

    await InitDb();
    providerSettings = await dataGenerator.FindOneByName(db, dataSettingStore, providerName);

    fs.createReadStream(req.file.path)
        .pipe(csv.parse())
        .on('data', async  function (dataRow) {

            await dataGenerator.InsertValues(db, dataStore, {
                UUID: dataRow[providerSettings.UUID].replace(/'/g, ''),
                VIN: dataRow[providerSettings.VIN].replace(/'/g, ''),
                Make: dataRow[providerSettings.Make].replace(/'/g, ''),
                Model: dataRow[providerSettings.Model].replace(/'/g, ''),
                Mileage: dataRow[providerSettings.Mileage].replace(/'/g, ''),
                Year: dataRow[providerSettings.Year].replace(/'/g, ''),
                Price: dataRow[providerSettings.Price].replace(/'/g, ''),
                'Zip Code': dataRow[providerSettings['Zip Code']].replace(/'/g, ''),
                'Create Date': dataRow[providerSettings['Create Date']].replace(/'/g, ''),
                'Update Date': dataRow[providerSettings['Update Date']].replace(/'/g, ''),
                Name: providerName.replace(/'/g, '')
            });
        })
        .on("error", function (data) {

            console.log(data);
            return 500;
        })
        .on("end", async function () {
            fs.unlinkSync(req.file.path);   // remove temp file
        });

    return 201;
}


const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);