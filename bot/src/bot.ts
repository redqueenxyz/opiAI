// Package Dependencies
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from "express"
import * as cors from "cors"

// Local Dependencies
import auther from './logic/auther'
import reciever from './logic/reciever'

// opiAI
// A bot that collections opinions.

// setting ===========================================================
require('dotenv').config();

// serving ============================================================
admin.initializeApp(functions.config().firebase)

// initializing =======================================================
const bot = express();

// getting ===========================================================
// bot.get('/webhook/', (req: Request, res: Response) => {
//     res.send("Connected!")
// })

bot.get('/', (req: Request, res: Response) => {
    res.send("Alive!")
})

// using =============================================================

bot.get('/webhook/', auther)
bot.get('/webhook/', reciever)

// exporting ==========================================================
export let opiAI = functions.https.onRequest(bot)

// // TODO: Reward function - (points/arcade style, kiip sdk integration, chart visualization)
// // TODO: Save Buzzfeed-esque questions into survey_0 for random questions anytime (Trivia Question)