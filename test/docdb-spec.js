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

        it('queryUsers calls queryUsers method', done => {
            docClient.prototype.queryUsers = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                var options = {};
                service.queryUsers(mockQuery, options)
                .then(() => {
                    expect(docClient.prototype.queryUsers).toHaveBeenCalledWith('dbs/mydb', mockQuery, options);
                    done();
                })
                .catch(done);
            });
        });

        it('queryPartitionKeyRanges calls queryPartitionKeyRanges method', done => {
            docClient.prototype.queryPartitionKeyRanges = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                var options = {};
                service.queryPartitionKeyRanges(mockQuery, options)
                .then(() => {
                    expect(docClient.prototype.queryPartitionKeyRanges).toHaveBeenCalledWith('dbs/mydb', mockQuery, options);
                    done();
                })
                .catch(done);
            });
        });

        it('queryTriggers calls queryTriggers method', done => {
            docClient.prototype.queryTriggers = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                var options = {};
                service.queryTriggers(mockQuery, options)
                .then(() => {
                    expect(docClient.prototype.queryTriggers).toHaveBeenCalledWith('dbs/mydb/colls/mycoll', mockQuery, options);
                    done();
                })
                .catch(done);
            });
        });

        it('queryUserDefinedFunctions calls queryUserDefinedFunctions method', done => {
            docClient.prototype.queryUserDefinedFunctions = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                var options = {};
                service.queryUserDefinedFunctions(mockQuery, options)
                .then(() => {
                    expect(docClient.prototype.queryUserDefinedFunctions).toHaveBeenCalledWith('dbs/mydb/colls/mycoll', mockQuery, options);
                    done();
                })
                .catch(done);
            });
        });

        it('queryPermissions calls queryPermissions method', done => {
            docClient.prototype.queryPermissions = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                var options = {};
                service.queryPermissions('myuser', mockQuery, options)
                .then(() => {
                    expect(docClient.prototype.queryPermissions).toHaveBeenCalledWith('dbs/mydb/users/myuser', mockQuery, options);
                    done();
                })
                .catch(done);
            });
        });

        it('queryAttachments calls queryAttachments method', done => {
            docClient.prototype.queryAttachments = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                var options = {};
                service.queryAttachments('mydoc', mockQuery, options)
                .then(() => {
                    expect(docClient.prototype.queryAttachments).toHaveBeenCalledWith('dbs/mydb/colls/mycoll/docs/mydoc', mockQuery, options);
                    done();
                })
                .catch(done);
            });
        });

        it('queryStoredProcedures calls queryStoredProcedures method', done => {
            docClient.prototype.queryStoredProcedures = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                service.queryStoredProcedures(mockQuery)
                .then(() => {
                    expect(docClient.prototype.queryStoredProcedures).toHaveBeenCalledWith('dbs/mydb/colls/mycoll', mockQuery);
                    done();
                })
                .catch(done);
            });
        });

        it('queryCollections calls queryCollections method', done => {
            docClient.prototype.queryCollections = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                service.queryCollections(mockQuery)
                .then(() => {
                    expect(docClient.prototype.queryCollections).toHaveBeenCalledWith('dbs/mydb', mockQuery);
                    done();
                })
                .catch(done);
            });
        });

        it('query calls queryDocuments method', done => {
            docClient.prototype.queryDocuments = getMockFunction();

            service.connect(mockConfig).then(()=>
            {
                service.query(mockQuery)
                .then(() => {
                    expect(docClient.prototype.queryDocuments).toHaveBeenCalledWith('dbs/mydb/colls/mycoll', mockQuery);
                    done();
                })
                .catch(done);
            });
        });
    });

} ());