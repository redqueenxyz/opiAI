// Manages logging and plugs into GCloud logging
'use strict';

// Google Cloud Debug Agent
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/debug-agent').start();
  require('@google-cloud/trace-agent').start();
}

// Google Logging via Winston
const winston = require('winston');
const expressWinston = require('express-winston');
const stackdriverTransport = require('@google-cloud/logging-winston');

// Logger to capture all requests and output them to the console.
const requestLogger = expressWinston.logger({
  transports: [
    new stackdriverTransport(),
    new winston.transports.Console({
      json: false,
      colorize: true,
    }),
  ],
  expressFormat: true,
  meta: false,
});

// Logger to capture any top-level errors and output json diagnostic info.
const errorLogger = expressWinston.errorLogger({
  transports: [
    new stackdriverTransport(),
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});

module.exports = {
  requestLogger: requestLogger,
  errorLogger: errorLogger,
  error: winston.error,
  warn: winston.warn,
  info: winston.info,
  log: winston.log,
  verbose: winston.verbose,
  debug: winston.debug,
  silly: winston.silly,
};
