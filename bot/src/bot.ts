// Package Dependencies
import * as express from "express"
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

// Local Dependencies
import auther from './logic/auther'
import reciever from './logic/reciever'

// opiAI
// A bot that collections opinions.

// initializing =======================================================
const bot = express();

// getting ===========================================================
bot.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello, I\'m Opi!")
})

bot.get('/webhook/', (req: express.Request, res: express.Response) => {
    auther(req, res)
        .catch(err => {
            console.error(`Error GETing from Webhook: ${err.stack}`);
            res.status(500).send(":C")
        })
})

// posting ===========================================================
bot.post('/webhook/', (req: express.Request, res: express.Response) => {
    reciever(req, res)
        .then(() => {
            console.log(`Successfully POSTed to Webhook`);
            res.sendStatus(200)
        })
        .catch(err => {
            console.log(`Error POSTing to Webhook`, err.stack);
            res.sendStatus(500)
        })
})


// notifying ==========================================================
console.log(`Opi alive!`)

// exporting ==========================================================
export let opiAI = functions.https.onRequest(bot)
