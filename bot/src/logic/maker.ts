// Temporary script to make and save surveys

// Package Dependencies
import * as admin from 'firebase-admin'
import { callMessengerProfile } from './sender'

// saving =============================================================

export async function surveyMaker(surveyID: string) {
    console.log(`Creating a Survey for Opi...`);

    let db = admin.firestore();

    return db
        .collection('surveys')
        .doc(`${surveyID}`)
        .set({
            "postback": `${surveyID}`,
            "questions": [{
                "quick_replies": [
                    {
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
                "text": "Here’s how it works: I'll ask you a question, and you hit a button! (You know how to hit buttons right?)"
            }, {
                "quick_replies": [{
                    "content_type": "text",
                    "payload": 2,
                    "title": "😂"
                }, {
                    "content_type": "text",
                    "payload": 2,
                    "title": "😜"

                }, {
                    "content_type": "text",
                    "payload": 2,
                    "title": "😛"
                }],
                "text": "That's pretty much it! Welcome to the beta!"
            }]
        })
        .then(snapshot => {
            console.log(`Saved ${surveyID} to Firestore: ${snapshot}`)
        })
        .catch(err => {
            console.log(`Error saving ${surveyID} to Firestore: ${err.stack}`)
        })
}

export async function greetingMaker() {
    console.log(`Changing Opi's Greeting on Facebook...`);
    let greeting = {
        "greeting": [
            {
                "locale": "default",
                "text": "Hello {{user_first_name}}!, I\'m Opi!"
            }
        ]
    }
    callMessengerProfile(greeting)
        .then(() => {
            console.log(`Updated Setting!`)
        })
        .catch(err => {
            console.log(`Error Updating Setting: ${err}`)
        })
};