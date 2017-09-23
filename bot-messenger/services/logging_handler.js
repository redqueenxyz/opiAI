// Manages logging settings and plugs into GCloud logging
'use strict';

// Google Cloud Debug Agent
let debug_agent = require('@google-cloud/debug-agent').start();
let trace_agent = require('@google-cloud/trace-agent').start();

// Google Logging via Winston
const winston = require('winston');
const transport = require('@google-cloud/logging-winston');
winston.add(transport);

module.exports = {
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  log: winston.log,
  verbose: winston.verbose,
  debug: winston.debug,
  silly: winston.silly,
};
