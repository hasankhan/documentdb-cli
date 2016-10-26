## documentdb-cli

Cross platform command line interface for DocumentDB

**NOTE: All Pull-Requests must be made into the `dev` branch.**

[![Build Status](https://travis-ci.org/hasankhan/documentdb-cli.svg)](https://travis-ci.org/hasankhan/documentdb-cli)

## Installation

You can install the documentdb-cli npm package.
```bash
npm install -g documentdb-cli
```

If you're more adventurous and like to live on the edge then you can install development version as follows:
```bash
git clone https://github.com/hasankhan/documentdb-cli
cd documentdb-cli
git checkout dev
npm install -g
```

## Get Started

To get the list of all parameters type 'documentdb -h'
```bash
  Usage: documentdb [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -s, --server <server>          Server to conect to
    -k, --masterKey <key>          The master key to use for authentication
    -d, --database <database>      Database to connect to
    -l, --collection <collection>  Collection to query
    -q, --query <query>            The query to execute
    -f, --format <format>          The format of output [table, csv, xml, json]
    -c, --config <path>            Read connection information from config file
```
To connect to a DocumentDB instance invoke documentdb as follows
```bash
documentdb -s https://abcdef.documents.azure.com -k u1d0wTrlTWPVoA== -d mydatabase -l mycollection
```

You will get a prompt as follows:
```bash
Connecting to https://abcdef.documents.azure.com...done

documentdb-cli version 0.0.0
Enter ".help" for usage hints.
documentdb>
```
To get the list of all commands use the '.help' command
```bash
documentdb> .help

command          description
---------------  ---------------------------------------
.help            Shows this message
.databases       Lists all the databases
.collections     Lists all the collections
.use db|coll id  Switches current database or collection
.read FILENAME   Execute commands in a file
.quit            Exit the cli
```

To exit the cli use the '.quit' command
```bash
documentdb> .quit
```