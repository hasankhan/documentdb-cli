var _ = require('underscore'),
    M = require('mstring'),
	sprintf = require("sprintf-js").sprintf;

var Queries = (function () {

    var Queries = {
        connectSql: function() {
            return M(function(){/***
                SELECT TOP 0 r.id FROM root r
            ***/});
        },
        listSysObjectsSql: function() {
            return M(function() {/***
                SELECT r.id, r._rid, r._self, r._ts FROM root r
            ***/});
        }
    };    

    return Queries;
})();

module.exports = exports = Queries;