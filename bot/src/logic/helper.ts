/// Helper Functions

// Package Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as facebook from 'fbgraph'
import * as express from 'express'

/**
 * Looks up user data from Facebook on user creation
 */
export let userUpdater = functions.firestore
    .document(`users/{userID}`)
    .onCreate(event => {
        const userID: string = event.params.userID
        const userEntry: object = event.data.data();

        console.log(`Retrieving User Data from Facebook for ${userID}`)

        return facebook
            .setVersion("2.10")
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
            .get(`${userID}`, (err: express.Error, res: express.Response) => {
                try {
                    console.log(`Retrieved this response from Facebook ${userID}: ${res}`)
                    return event.data.ref.update(res);
                } catch (err) {
                    console.log(`Error updating User Data for ${userID}: ${err.stack}`)
                }
            })
    })


export let interestFinder = functions.https
    .onRequest((req: express.Request, res: express.Response) => {


        // Standard Targeting Spec
        const gender: Number = req.query.gender || 0 // (0 = all (default), = male, 2 = female)
        const age_min: Number = req.query.age_min || 13 // (>= 13)
        const age_max: Number = req.query.age_max || 65 // (=< 65)


        // TODO: Fancy targeting works and yields results. Now incorporate the age_min, age_max, and gender to get reach estimates


        // Fancy Targeting Spec
        const type: String = req.query.category || undefined // (adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)
        const query: String = req.query.query || undefined // (keyword)

        // TODO: Working: adgeolocation, audienceinterest

        console.log(`Attempting to lookup ${query} for ${type}.`)

        return facebook
            .setVersion("2.9")
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
            .get(`/search?type=${type}&q=${query}`, (error: express.Error, response: express.Response) => {
                try {
                    console.log(`Retrieved data from Facebook! ${JSON.stringify(response.data)}`)
                    res.status(200).send(response.data)
                } catch (error) {
                    console.log(`Error retrieving data from Facebook! ${error.stack}`)
                    res.sendStatus(503)
                }
            })
    })