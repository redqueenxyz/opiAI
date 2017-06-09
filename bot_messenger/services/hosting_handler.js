// Manages Google Cloud Platform interaction 

// Config
var gcpAccount = require("../config/gcp.json");

// StackDriver
require('@google-cloud/debug-agent').start({
  allowExpressions: true,
  projectId: gcpAccount.project_id,
  keyFilename: './bot_messenger/config/gcp.json'
});