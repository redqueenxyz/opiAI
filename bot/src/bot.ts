// Package Dependencies
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from "express"
import * as logger from "winston"

// Local Dependencies
import './env'
import reciever from './logic/reciever'

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
// using =============================================================
bot.get('/webhook/', (req: express.Request, res: express.Response) => {
    reciever(req, res)
        .catch(err => {
            console.log("Error at Webhook:", err.stack);
            res.status(500).send('error');
        })
})

console.log('opiAI online.')
// exporting ==========================================================
export let opiAI = functions.https.onRequest(bot)

// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)