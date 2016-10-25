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
        listObjectsSql: function() {		
			return M(function(){/***
				  SELECT * FROM root r
			***/});
		}
    };    

    return Queries;
})();

module.exports = exports = Queries;