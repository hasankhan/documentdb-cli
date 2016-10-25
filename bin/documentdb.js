var DocumentDBCli = require('../lib/cli');

var argv = process.argv.splice(0);
var cli = new DocumentDBCli();
cli.run(argv, process.env);