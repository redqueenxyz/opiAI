
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
            .setAccessToken(process.env.FACEBOOK_ACCESS_TOKEN)
            .get(`${userID}`, (err, res) => {
                try {
                    return event.data.ref.update(res);
                } catch (err) {
                    console.log(`Error updating User Data for ${userID}: ${err.stack}`)
                }
            })
    })




export let reachEstimate = functions.https
    .onRequest((req: express.Request, res: express.Response) => {
        // const genderID: number = req.query.genders || 0
        const category: string = req.query.category || undefined
        const query: string = req.query.keyword || undefined

        console.log(`Looking up ${query} in ${category}`)
        // genders [0 = all (default), = male, 2 = female]
        // age_min (>= 13)
        // age_max (=< 65)
        // category (adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)
        // keyword
        facebook
            .setVersion("2.10")
            .setAccessToken(process.env.FACEBOOK_TOKEN)
            .get(`search?type=${category}&q=${query}`,
            // { currency: 'USD' },
            (response: express.Response, error: express.Error) => {
                try {
                    // TODO: https://developers.facebook.com/tools/explorer/1881894932060023?method=GET&path=search%3Ftype%3Dadgeolocation%26q%3Dcanada&version=v2.9
                    console.log(response)
                    res.sendStatus(200)
                } catch (error) {
                    console.log(`Error estimating Reach: ${error}`)
                }
            })
    })