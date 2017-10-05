'use strict';
import message_handler from 'messenger';
const barFunction = require('./bar');

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request');
let logger = require('winston');


import {bot} from 'bot';
// intialize firebase
admin.initializeapp(functions.config().firebase);

/** 
 * Serves the bot!
 */

functions.https.onRequest(bot);

/** 
 * gets user data and update our entry in the db
 */
exports.getuserdata = functions.database.ref('users/{userid}')
  .oncreate((event) => {
    const userid = event.params.userid;
    const pageid = 'eaaavks7uf3cbadxbtzao4bc3nbzcl6ifmhscpzbn9zbrqyu9r2kbokn8yudcldlhf2qhaw5zapul1c9ymhmi9oorsywlbysrk0unwizmzahpvi7ngcmmgl9csvp2q8qasojmsyosvn0jvlwlpayzaohb3om4xf67ytihtrcazuzaqzdzd';

    // TODO: Change this to use isomorphic fetch?
    request
      .get({
        url: 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,gender&access_token=' + pageid,
        json: true,
        headers: {'user-agent': 'request'},
      }, (err, res, data) => {
        admin.database().ref('users/' + userid)
          .update({
            firstname: data.first_name,
            lastname: data.last_name,
            language: data.locale,
            gender: data.gender,
          })
          .then(() => {
            console.log('successly queried facebook, and updated database!');
          });
      })
      .on('error', (err) => {
        console.error('error querying facebook!');
      });
  });

exports.makechart = functions.database.ref('responses/{surveyid}').onupdate((event) => {
  const surveyID = event.params.userID;
  console.log(surveyID);
});
