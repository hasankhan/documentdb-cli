var proxyquire =  require('proxyquire').noPreserveCache(),
    Q = require('q'),
    _ = require('underscore'),
    Queries = require('../lib/commands/queries'),
    Utils = require('../lib/commands/utils'),
    Invoker = require('../lib/commands').Invoker;

describe('Invoker', () => {
    var readline, exit, invoker, db, messages, writer;

    function mockCommands(invoker, mocks, db, names) {
        names.forEach(function(name){
            var CommandType = proxyquire('../lib/commands/' + name, mocks);
            var command = new CommandType(db);
            invoker.commands = _.map(invoker.commands, function(cmd) {
                return (cmd.constructor.name == command.constructor.name) ? command : cmd; 
            });
        });        
    }

    beforeEach(() => {
        messages = {};
        db = {};
        readline = {
            on: jasmine.createSpy(),
            pause: jasmine.createSpy()
        };

        mockDbFunc('query');

        writer = {
            write: jasmine.createSpy()
        };
        exit = jasmine.createSpy();

        Utils.readFile = jasmine.createSpy().andReturn(readline);
        
        var mocks = {
            './utils': Utils,
            '../../external/exit': exit
        };

        invoker = new Invoker(db, messages, writer);
        mockCommands(invoker, mocks, db, ['read', 'quit']);
    });

    function mockDbFunc(func) {
        db[func] = jasmine.createSpy().andReturn(new Q([]));
    }

    it('.help returns commands reference', done => {
        writer.write.andCallFake(function(items) {
            var commands = [
                { command: '.help', description: 'Shows this message' },
                { command: '.databases', description: 'Lists all the databases' },
                { command: '.collections', description: 'Lists all the collections' },
                { command: '.read FILENAME', description: 'Execute commands in a file' },
                { command: '.storedprocs', description: 'Lists all the stored procedures' },
                { command: '.conflicts', description: 'Lists all the conflicts' },
                { command: '.triggers', description: 'Lists all the triggers' },
                { command: '.functions', description: 'Lists all the user defined functions' },
                { command: '.permissions USER', description: 'Lists all the permissions' },
                { command: '.attachments DOC', description: 'Lists all the attachments' },
                { command: '.users', description: 'Lists all the users' },
                { command: '.use db|coll ID', description: 'Switches current database or collection' },
                { command: '.quit', description: 'Exit the cli' }
            ];
            commands.forEach(cmd => { 
                expect(_.findWhere(items, cmd)).toBeDefined();
            });
            expect(items.length).toEqual(commands.length);

            done();
        });

        invoker.run('.help');
    });

    it('.collections runs the listSysObjectsSql query', () => {
        mockDbFunc('queryCollections');
        invoker.run('.collections');
        expect(db.queryCollections).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.databases runs the listSysObjectsSql query', () => {
        mockDbFunc('queryDatabases');
        invoker.run('.databases');
        expect(db.queryDatabases).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.permissions runs the listSysObjectsSql query', () => {
        mockDbFunc('queryPermissions');
        invoker.run('.permissions abc');
        expect(db.queryPermissions).toHaveBeenCalledWith('abc', Queries.listSysObjectsSql());
    });

    it('.attachments runs the listSysObjectsSql query', () => {
        mockDbFunc('queryAttachments');
        invoker.run('.attachments abc');
        expect(db.queryAttachments).toHaveBeenCalledWith('abc', Queries.listSysObjectsSql());
    });

    it('.storedprocs runs the listSysObjectsSql query', () => {
        mockDbFunc('queryStoredProcedures');
        invoker.run('.storedprocs');
        expect(db.queryStoredProcedures).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.triggers runs the listSysObjectsSql query', () => {
        mockDbFunc('queryTriggers');
        invoker.run('.triggers');
        expect(db.queryTriggers).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.conflicts runs the listSysObjectsSql query', () => {
        mockDbFunc('queryConflicts');
        invoker.run('.conflicts');
        expect(db.queryConflicts).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.functions runs the listSysObjectsSql query', () => {
        mockDbFunc('queryUserDefinedFunctions');
        invoker.run('.functions');
        expect(db.queryUserDefinedFunctions).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.users runs the listSysObjectsSql query', () => {
        mockDbFunc('queryUsers');
        invoker.run('.users');
        expect(db.queryUsers).toHaveBeenCalledWith(Queries.listSysObjectsSql());
    });

    it('.use changes db', () => {
        invoker.run('.use db abc');
        expect(db.database).toEqual('abc');
    });

    it('.use changes coll', () => {
        invoker.run('.use coll def');
        expect(db.collection).toEqual('def');
    });

    it('.read runs the commands in file', done => {
        messages.echo = jasmine.createSpy();

        invoker.run('.read test');

        expect(readline.on).toHaveBeenCalledWith('line', jasmine.any(Function));

        lineCallback = _.find(readline.on.argsForCall, function(args) { return args[0] == 'line'; })[1];
        db.query.andCallFake(function(query) {
            expect(messages.echo).toHaveBeenCalledWith('SELECT *\r\nFROM test');
            expect(query).toEqual('SELECT *\r\nFROM test');
            done();

            return new Q(0);
        });

        lineCallback('SELECT *\\');
        lineCallback('FROM test');
    });

    it('.quit exits the app', () => {
        invoker.run('.quit');
        expect(exit).toHaveBeenCalled();
    });
});