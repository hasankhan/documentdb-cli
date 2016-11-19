(() => {
    "use strict";

    var proxyquire = require('proxyquire').noPreserveCache(),
        _ = require('underscore'),
        Q = require('q'),
        Queries = require('../lib/commands/queries');

    describe('DocumentDbService', () => {
        var docClient, service, mockResult, mockQuery, mockConfig;

        function setup() {
            docClient = class { };
            mockResult = {
                toArray: jasmine.createSpy().andCallFake(callback => {
                    callback(null, []);
                })
            };
            mockConfig = {
                host: 'https://example',
                masterKey: 'abc',
                database: 'mydb',
                collection: 'mycoll'
            };
            mockQuery = 'select * from r';            
            var DocumentDBService = proxyquire('../lib/docdb', {
                'documentdb': {
                    DocumentClient: docClient
                }
            });
            docClient.prototype.queryDatabases = getMockFunction();            
            service = new DocumentDBService();
        }

        function getMockFunction() {
            return jasmine.createSpy().andReturn(mockResult);
        }

        beforeEach(() => {
            setup();
        });

        it('connect calls queryDatabases method', done => {
            service.connect(mockConfig)
            .then(() => {
                expect(docClient.prototype.queryDatabases).toHaveBeenCalledWith(Queries.connectSql());
                done();
            })
            .catch(done);
        });

        it('queryDatabases calls queryDatabases method', done => {
            service.connect(mockConfig).then(()=>
            {
                service.queryDatabases(mockQuery)
                .then(() => {
                    expect(docClient.prototype.queryDatabases).toHaveBeenCalledWith(mockQuery);
                    done();
                })
                .catch(done);
            });
        });

        it('queryConflicts calls queryConflicts method', done => {
            docClient.prototype.queryConflicts = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                service.queryConflicts(mockQuery)
                .then(() => {
                    expect(docClient.prototype.queryConflicts).toHaveBeenCalledWith('dbs/mydb/colls/mycoll', mockQuery);
                    done();
                })
                .catch(done);
            });
        });
    });

} ());