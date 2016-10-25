var pjson = require('../package.json'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    sprintf = require("sprintf-js").sprintf;

var DEFAULT_CONFIG = 'documentdb-conf.json';

var Options = (function() {
    function Options() {
        this.version = pjson.version;
    }

    Options.prototype.init = function (argv, env) {
        var program = require('commander');

        program.version( this.version )
                .option( '-s, --server <server>', 'Server to conect to' )
                .option( '-k, --masterKey <key>', 'The master key to use for authentication' )
                .option( '-q, --query <query>', 'The query to execute' )
                .option( '-f, --format <format>', 'The format of output [table, csv, xml, json]')
                .option( '-c, --config <path>', 'Read connection information from config file')
                .parse( argv );        

        this.env = env;
        this.args = {};
        _.extend(this.args, _.pick(program, 'server', 'masterKey', 'query', 'format', 'config'));

        if (this.args.config && !fs.existsSync(this.args.config)) {
            throw new Error(sprintf('config file \'%s\' does not exist.', this.args.config));
        }
    };

    Options.prototype.getConnectionInfo = function() {
        var args = this.args || {},
            env = this.env || {},
            configPath = args.config || DEFAULT_CONFIG;

        var config = {};

        if (fs.existsSync(configPath)) {
            config = require(path.resolve(configPath));
        }

        var defaults = {
            server: env.DOCUMENTDBCLI_SERVER,
            masterKey: env.DOCUMENTDBCLI_MASTERKEY
        };

        config = _.extend({}, defaults, config, args);

        var connectInfo = {
            host: config.server,
            masterKey: config.masterKey
        };

        return connectInfo;
    };

    return Options;
})();

module.exports = exports = Options;
