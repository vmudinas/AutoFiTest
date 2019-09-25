var assert = require('assert');
    supertest = require('supertest');
var request = supertest('localhost:3000');

describe('upload', function () {
    it('a file', function (done) {
        request.post('/upload')
            .field('providerName', 'TestProviderB}')
            .attach('file', './test/test.csv')
            .end(function (err, res) {

                done(assert.equal(res.status, 200));
            });
    });
});