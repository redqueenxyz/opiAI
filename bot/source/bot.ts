// Package Dependencies
import * as admin from 'firebase-admin'
import * as express from "express"

// Local Dependencies
import './env'
import auther from './logic/auther'
import reciever from './logic/reciever'

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
            res.sendStatus(200)
        })
        .catch(err => {
            console.log(`Error Getting from Webhook`, err.stack);
            res.sendStatus(500)
        })
})

// posting ===========================================================
bot.post('/webhook/', (req: express.Request, res: express.Response) => {
    reciever(req, res)
        .then(() => {
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