var proxyquire =  require('proxyquire').noPreserveCache(),
    _ = require('underscore'),
    utils = require('./utils');

describe('Options', function() {
    var fs, path, options, config;

    function setup() {
        // remove commander from require cache
        utils.unloadModule('commander');
        
        fs = {};
        path = {};
        config = { '@noCallThru': true };
        var Options = proxyquire('../lib/options', {
            'fs': fs,
            'path': path,
            'documentdb-conf.json': config,
            'test-conf.json': config
        });
        options = new Options();
    }

    describe('init', function() {
        beforeEach(function() {
           setup(); 
        });

        it('parses and copies args', function() {
            fs.existsSync = jasmine.createSpy().andReturn(true);

            options.init([
                'node.exe', 'documentdb.js',
                '-s', 'https://asdf.documents.azure.com',
                '-k', 'abcdef==',
                '-d', 'mydb',
                '-l', 'mycoll',
                '-q', '.databases',
                '-f', 'xml',
                '-c', 'config.json'
            ], {});

            expect(options.args).toEqual({
                server: 'https://asdf.documents.azure.com',
                masterKey: 'abcdef==',
                database: 'mydb',
                collection: 'mycoll',
                query: '.databases',
                format: 'xml',
                config: 'config.json'
            });
        });

        it('throws if config does not exist', function() {
            fs.existsSync = jasmine.createSpy().andReturn(false);

            var args = [
                'node.exe', 'test.js',
                '-c', 'config.json'
            ];

            var err = new Error("config file 'config.json' does not exist.");
            expect(options.init.bind(options, args, {})).toThrow(err);
        });
    });

    describe('getConnectionInfo', function() {
        beforeEach(function() {
           setup(); 
        });

        it('defaults the config file name to documentdb-conf.json', function () {
            path.resolve = jasmine.createSpy().andReturn('documentdb-conf.json');
            fs.existsSync = jasmine.createSpy().andReturn(true);

            options.getConnectionInfo();

            expect(fs.existsSync).toHaveBeenCalledWith('documentdb-conf.json');
        });

        it('creates the config object', function () {
            path.resolve = jasmine.createSpy().andReturn('test-conf.json');
            fs.existsSync = jasmine.createSpy().andReturn(true);

            options.init([
                'node.exe', 'mssql.js',
                '-s', 'example.com',
                '-k', 'thekey==',
                '-d', 'catalog',
                '-l', 'collection',
                '-q', '.collections',
                '-f', 'json',
                '-c', 'test-conf.json'
            ], {});

            var info = options.getConnectionInfo();

            expect(info).toEqual({
                masterKey: 'thekey==',
                host: 'example.com',
                database: 'catalog',
                collection: 'collection',
            });
        });

        it('args override config', function () {
            path.resolve = jasmine.createSpy().andReturn('test-conf.json');
            fs.existsSync = jasmine.createSpy().andReturn(true);

            config.server = 'example2.com';
            config.masterKey = 'thekey==';

            options.init([
                'node.exe', 'test.js',
                '-s', 'example.com',
            ], {});

            var info = options.getConnectionInfo();

            expect(info).toEqual({
                host: 'example.com',
                masterKey: 'thekey==',
                database: undefined,
                collection: undefined
            });
        });
    });
});