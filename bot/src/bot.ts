// Package Dependencies
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from "express"
import * as logger from "winston"

// Local Dependencies
import './env'
import reciever from './logic/reciever'
import auther from './logic/auther'

// opiAI
// A bot that collections opinions.

// serving ============================================================
admin.initializeApp(functions.config().firebase)

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
            logger.log("Error getting from Webhook:", err.stack);
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
            logger.log("Error posting to Webhook:", err.stack);
            res.status(500).send('error');
        })
})


// notifying ==========================================================
console.log("Opi alive!")

// exporting ==========================================================
export let opiAI = functions.https.onRequest(bot)

// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)