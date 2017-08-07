// Provides a webhook and routes requests

// Main Router
const bot_router = require('express').Router(); // create a new instance of Router
let bodyParser = require('body-parser');

// Parsing
bot_router.use(bodyParser.json());
bot_router.use(bodyParser.urlencoded({extended: true}));

// Homepage 
bot_router.get('/', (req, res) => {
  res.status(200).json({message: 'Connected!'});
});

// Routes
bot_router.use('/webhook', require('./webhook_auther'));
bot_router.use('/webhook', require('./object_reciever'));

module.exports = bot_router;
