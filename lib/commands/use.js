(function () {
    "use strict";

    var Utils = require('./utils'),
        Q = require('q'),
        Queries = require('./queries');

    class UseCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.use';
            this.usage = '.use db|coll id';
            this.description = 'Switches current database or collection';
        }

        run(messages, writer, args) {
            if (!Utils.validateArgs(args, 2)) {
                return Q.reject('db|coll and id must be specified');
            }

            if (args[0] == 'db') {
                this.db.database = args[1];
            }
            else if (args[0] == 'coll') {
                this.db.collection = args[1];
            }
            else {
                return Q.reject('only db|coll are valid values.');
            }

            return new Q();
        }
    }

    module.exports = exports = UseCommand;

} ());