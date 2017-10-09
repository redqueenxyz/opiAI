
// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as facebook from 'fbgraph'
import * as express from 'express'

/// Helper Functions

/**
 * Looks up user data from Facebook on user creation
 */
export let userUpdater = functions.firestore
    .document('users/{userID}')
    .onCreate(event => {
        const userID: string = event.params.userID
        let userEntry: object = event.data.data();

        console.log(`Retrieving User Data from Facebook for ${userID}`)
        return facebook
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
            .get(`${userID}`, (err, res) => {
                return event.data.ref.update(res);
            })
            .catch(err => {
                console.log(`Error updating User Data for ${userID}: ${err.stack}`)
            })
    })


export let reachEstimate = functions
    .https
    .onRequest((req: express.Request, res: express.Response) => {
        console.log(req.query)
        console.log(req.body)
        return res.status(200).send(formattedDate)
    })