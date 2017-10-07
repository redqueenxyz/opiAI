// Package Dependencies
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from "express"

// Local Dependencies
import './env'
import reciever from './logic/reciever'
import auther from './logic/auther'

// opiAI
// A bot that collections opinions.

// initializing =======================================================
const bot = express();

// getting ===========================================================
bot.get('/', (req: express.Request, res: express.Response) => {
    res.send("Alive!")
})

bot.get('/webhook/', (req: express.Request, res: express.Response) => {
    auther(req, res)
        .then(() => {
            res.send(200)
        })
        .catch(err => {
            console.log("Error getting from Webhook:", err.stack);
            res.status(500).send('error');
        })
})

// posting ===========================================================
bot.post('/webhook/', (req: express.Request, res: express.Response) => {
    reciever(req, res)
        .then(() => {
            res.send(200)
        })
        .catch(err => {
            console.log("Error posting to Webhook:", err.stack);
            res.status(500).send('error');
        })
})

// saving =============================================================
var db = admin.firestore();

var docRef = db.collection('surveys').doc('survey_0').set({
    "postback": "survey_0",
    "questions": [{
        "quick_replies": [{
            "content_type": "text",
            "image_url": "",
            "payload": 0,
            "title": "You collect what?"
        }, {
            "content_type": "text",
            "image_url": "https://i.imgur.com/Qwca6NZ.png",
            "payload": 0,
            "title": "Hi Opi!"
        }],
        "text": "Hello, my name is Opi. I collect opinions!"
    }, {
        "quick_replies": [{
            "content_type": "text",
            "image_url": "https://i.imgur.com/Qwca6NZ.png",
            "payload": 1,
            "title": "Yes"
        }, {
            "content_type": "text",
            "image_url": "http://petersfantastichats.com/img/green.png",
            "payload": 1,
            "title": "Duh?"
        }],
        "text": "Do you know how to hit buttons?"
    }, {
        "quick_replies": [{
            "content_type": "text",
            "payload": 2,
            "title": "😂"
        }, {
            "content_type": "text",
            "payload": 2,
            "title": "😛"
        }],
        "text": "Welcome to Feedback!"
    }]
})
    .then(ref => {
        console.log("saved!")
    })



// notifying ==========================================================
console.log("Opi alive!")

// exporting ==========================================================
export let opiAI = functions.https.onRequest(bot)

// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)