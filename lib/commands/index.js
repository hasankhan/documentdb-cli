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
            DatabasesCommand: require('./databases'),
            HelpCommand: require('./help'),
            QuitCommand: require('./quit'),
            ReadCommand: require('./read'),
            Utils: require('./utils')
        };

    } ()); 