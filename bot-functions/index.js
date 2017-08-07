const functions = require('firebase-functions');
const logger = require('winston');
const request = require('request');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1; // london is UTC + 1hr;
  res.status(200).send(`<!doctype html>
      <head>
        <title>Time</title>
      </head>
      <body>
        ${'BONG '.repeat(hours)}
      </body>
    </html>`);
});

exports.getUserData = functions.database.ref('users/{userID}')
  .onWrite((event) => {
    const userID = event.data.val();
    const pageID = 'EAAavks7uF3cBADXbtZAo4BC3nbZCL6IfMHsCPZBn9ZBRQyu9r2KbOkN8YUdclDLHf2QHAw5ZApUl1C9ymhmi9ooRsYWlBySrK0unwizMZAhpVi7NgcMMgl9CsVP2Q8qAsOjMSyosvn0JvLwlpaYZAohb3OM4Xf67yTIHtRcAzUzAQZDZD';

    logger.log('Getting information for', {userID});

    request.get('https://graph.facebook.com/v2.6/' + userID + '?fields=first_name,last_name,locale,gender&access_token=' + pageID, (response) => {
      logger.log(response);
    })
      .on((response) => {
        logger.info(response.statusCode);
      })
      .on((error) => {
        logger.error(error);
      });
  });
