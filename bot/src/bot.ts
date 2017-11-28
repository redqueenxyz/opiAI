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
bot.get('*', (req: express.Request, res: express.Response) => {
    req.url = `/${req.url}` // Prepend the slash
    res.sendStatus(200)
    return bot(req, res)
})

bot.get('webhook/', (req: express.Request, res: express.Response) => {
    auther(req, res)
        .catch(err => {
            console.error(`Error GETing from Webhook: ${err.stack}`);
            res.write(500)
        })
})

// posting ===========================================================
bot.post('webhook/', (req: express.Request, res: express.Response) => {
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
