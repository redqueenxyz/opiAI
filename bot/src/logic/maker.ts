// Temporary script to make and save surveys

// Package Dependencies
import * as admin from 'firebase-admin'

// saving =============================================================
// var db = admin.firestore();

// var docRef = db.collection('surveys')
//     .doc('survey_0')
//     .set({
//         "postback": "survey_0",
//         "questions": [{
//             "quick_replies": [
//                 {
//                     "content_type": "text",
//                     "image_url": "https://i.imgur.com/Qwca6NZ.png",
//                     "payload": 0,
//                     "title": "Hi Opi!"
//                 }],
//             "text": "Hello, my name is Opi. I collect opinions!"
//         }, {
//             "quick_replies": [{
//                 "content_type": "text",
//                 "image_url": "https://i.imgur.com/Qwca6NZ.png",
//                 "payload": 1,
//                 "title": "Yes"
//             }, {
//                 "content_type": "text",
//                 "image_url": "http://petersfantastichats.com/img/green.png",
//                 "payload": 1,
//                 "title": "Duh?"
//             }],
//             "text": "Here’s how it works: I'll ask you a question, and you hit a button! (You know how to hit buttons right?)"
//         }, {
//             "quick_replies": [{
//                 "content_type": "text",
//                 "payload": 2,
//                 "title": "😂"
//             }, {
//                 "content_type": "text",
//                 "payload": 2,
//                 "title": "😜"

//             }, {
//                 "content_type": "text",
//                 "payload": 2,
//                 "title": "😛"
//             }],
//             "text": "That's pretty much it! Welcome to the beta!"
//         }]
//     })
//     .then(ref => {
//         console.log("saved!")
//     })
