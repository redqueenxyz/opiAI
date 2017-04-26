// Main Router
const router = require('express').Router(); // create a new instance of Router

// Homepage 
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// Routes
router.use('/webhook', require('./webhook'))

module.exports = router; // export this as 'routes'