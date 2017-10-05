// Provides a webhook and routes requests

// Main Router
const router = require('express').Router(); // create a new instance of Router
let bodyParser = require('body-parser');

// Parsing
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

// Homepage 
router.get('/', (req, res) => {
  res.status(200).json({message: 'Connected!'});
});

// Routes
router.use('/webhook', require('./webhook_auther'));
router.use('/webhook', require('./object_reciever'));

module.exports = router;
