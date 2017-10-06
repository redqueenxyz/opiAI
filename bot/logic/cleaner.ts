//

import { } from 'dotenv/config';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const userID: string = event.params.userID || "1178458725593438"
const pageID: string = process.env.PAGEID || "EAAavks7uF3cBADXbtZAo4BC3nbZCL6IfMHsCPZBn9ZBRQyu9r2KbOkN8YUdclDLHf2QHAw5ZApUl1C9ymhmi9ooRsYWlBySrK0unwizMZAhpVi7NgcMMgl9CsVP2Q8qAsOjMSyosvn0JvLwlpaYZAohb3OM4Xf67yTIHtRcAzUzAQZDZD"

fetch('https://graph.facebook.com/v2.6/${userID}?fields=first_name,last_name,locale,gender&access_token=${pageID}')
    .then(res => {
        admin.firestore
            .document('users/${userID}')
            .onUpdate({
                firstname: data.first_name,
                lastname: data.last_name,
                language: data.locale,
                gender: data.gender,
            })
            .then(() => {
                console.log('successly queried facebook, and updated database!');
            });
    })
    .catch(err => {
        console.error(err)
    });
/** 
 * gets user data and update our entry in the db
 */
// exports.userUpdater = functions.firestore
//     .document('users/{userID}')
//     .onUpdate(event => {
//     })
// // TODO: Change this to use isomorphic fetch?
// request
//     .get({
//         url: 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,gender&access_token=' + pageid,
//         json: true,
//         headers: { 'user-agent': 'request' },
//     }, (err, res, data) => {
//     });

// exports.makechart = functions.database.ref('responses/{surveyid}').onupdate((event) => {
//     const surveyID = event.params.userID;
//     console.log(surveyID);
// });