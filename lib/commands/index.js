    (function () {
        "use strict";

        var _str = require('underscore.string');

        function createAll(db) {
            var commands = [];
            Object.keys(module.exports).forEach(function (k) {
                if (_str.endsWith(k, 'Command')) {
                    commands.push(new module.exports[k](db));
                }
            });
            return commands;
        }

        module.exports = exports = {
            Invoker: require('./invoker'),
            createAll: createAll,
            HelpCommand: require('./help'),
            DatabasesCommand: require('./databases'),
            CollectionsCommand: require('./collections'),
            StoredProcsCommand: require('./sprocs'),
            UseCommand: require('./use'),
            ReadCommand: require('./read'),
            QuitCommand: require('./quit'),
            Utils: require('./utils')
        };

    } ()); 