
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
    .document(`respondents/{userID}`)
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



/**
 * Queries the Facebook Ad API for matching interests
 */
export let interestLookup = functions.https
    .onRequest((req: express.Request, res: express.Response) => {


        // Standard
        const gender: number = req.query.genders || 0  // genders [0 = all (default), = male, 2 = female]
        const minAge: number = req.query.minAge || 13  // age_min (>= 13)
        const maxAge: number = req.query.maxAge || 65  // age_max (=< 65)

        // Fancy
        // (adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)
        const category: string = req.query.category || undefined
        const keyword: string = req.query.keyword || undefined


        // TODO: https://developers.facebook.com/tools/explorer/1881894932060023?method=GET&path=search%3Ftype%3Dadgeolocation%26q%3Dcanada&version=v2.9

        console.log(`Looking up ${keyword} in ${category}`)
        return facebook
            .setVersion("2.11")
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
            .get(`search?type=${category}&q=${query}`,
            //             (response: express.Response, error: express.Error) => {
            //                 try {
            //                     // TODO: https://developers.facebook.com/tools/explorer/1881894932060023?method=GET&path=search%3Ftype%3Dadgeolocation%26q%3Dcanada&version=v2.9
            //                     console.log(response)
            //                     res.sendStatus(200)
            //                 } catch (error) {
            //                     console.log(`Error estimating Reach: ${error}`)
            //                 }
            //             })

            q: keyword,
            type: category
            }, (response: express.Response, error: express.Error) => {
        try {
            console.log(response)
            console.log(`Looked up ${keyword} in ${category}! ${response.data}`)
            res.sendStatus(200)
        } catch (error) {
            console.log(error)
            console.log(`Failed to look up ${keyword} in ${category}`)
            res.sendStatus(500)
        }
    })
    })