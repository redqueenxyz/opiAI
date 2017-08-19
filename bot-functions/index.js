const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');

// Intialize Firebase
admin.initializeApp(functions.config().firebase);

/** 
 * Gets User Data and update our entry in the DB
 */
exports.getUserData = functions.database.ref('users/{userID}')
  .onCreate((event) => {
    const userID = event.params.userID;
    const pageID = 'EAAavks7uF3cBADXbtZAo4BC3nbZCL6IfMHsCPZBn9ZBRQyu9r2KbOkN8YUdclDLHf2QHAw5ZApUl1C9ymhmi9ooRsYWlBySrK0unwizMZAhpVi7NgcMMgl9CsVP2Q8qAsOjMSyosvn0JvLwlpaYZAohb3OM4Xf67yTIHtRcAzUzAQZDZD';

    request
      .get({
        url: 'https://graph.facebook.com/v2.6/' + userID + '?fields=first_name,last_name,locale,gender&access_token=' + pageID,
        json: true,
        headers: {'User-Agent': 'request'},
      }, (err, res, data) => {
        admin.database().ref('users/' + userID)
          .update({
            firstName: data.first_name,
            lastName: data.last_name,
            language: data.locale,
            gender: data.gender,
          })
          .then(() => {
            console.log('Successly quereed Facebook, and updated Database!');
          });
      })
      .on('error', (err) => {
        console.error('Error querying Facebook!');
      });
  });

exports.makeChart = functions.database.ref('responses/{surveyID}').onUpdate((event) => {
  const surveyID = event.params.userID;
  console.log(surveyID);
});
