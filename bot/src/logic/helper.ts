
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
        const userEntry: object = event.data.data()

        console.log(`Retrieving User Data from Facebook for ${userID}`)

        return facebook
            .setVersion("2.10")
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
            .get(`${userID}`, (error, response) => {
                    if (error) {
                        console.log(`Error updating user data for ${userID} : ${JSON.stringify(error)}`)
                        return res.sendStatus(500)
                    } else {
                        console.log(`Retrieved user response from Facebook ${userID}: ${res}`)
                        return event.data.ref.update(res);
                    }
            })
    })


/** 
 * Saves the Facebook Targeting Spec from Survey step 2
 *
 */
export let adMaker = functions.firestore
.document(`surveys/{surveyID}`)
.onUpdate(event => {

    //TODO: 
    // 1) When a survey is created or update, grab its targeting information 
    // 2) Save that targeting spec https://developers.facebook.com/docs/marketing-api/buying-api/targeting, using "keys" for adgeolocation and "FBID" from interestLookup()
    // 3) 
        // Standard
        // const gender: number = req.query.genders || 0  // genders [0 = all (default), = male, 2 = female]
        // const minAge: number = req.query.minAge || 13  // age_min (>= 13)
        // const maxAge: number = req.query.maxAge || 65  // age_max (=< 65)

})


/**
 * Queries the Facebook Ad API via Adgeolocation Search
 * https://developers.facebook.com/docs/marketing-api/targeting-search
 */
export let locationLookup = functions.https
    .onRequest((req: express.Request, res: express.Response) => {

        const query: string = req.query.query || undefined

        console.log(`Finding locations matching "${query}"...`)
        return facebook
            .setVersion("2.11")
            .setOptions({
                timeout:  3000
              , pool:     { maxSockets:  Infinity }
              , headers:  { connection:  "keep-alive" } })
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
            .get(`search?q=${query}&type=adgeolocation` , (error, response) => {
                    if (error) {
                        console.log(`Error retrieving location results for "${query}" : ${JSON.stringify(error)}`)
                        return res.sendStatus(500)
                    } else {
                        console.log(`Retrieved location results for "${query}" : ${response.data}`)
                        return res.status(200).send(response.data) 
                    }
            })
    })


/**
 * Queries the Facebook Ad API via Detailed Targeting Search
 * https://developers.facebook.com/docs/marketing-api/targeting-search
 */
export let targetingLookup = functions.https
    .onRequest((req: express.Request, res: express.Response) => {

        // Detailed Targeting Search
        //https://developers.facebook.com/docs/marketing-api/targeting-search
        const category: string = req.query.category || undefined
        const query: string = req.query.query || undefined

        console.log(`Finding demographics, interests, or behaviours matching "${query}"...`)
        return facebook
            .setVersion("2.11")
            .setOptions({
                timeout:  3000
              , pool:     { maxSockets:  Infinity }
              , headers:  { connection:  "keep-alive" } })
            .setAccessToken(process.env.FACEBOOK_AD_TOKEN)
            .get(`act_464981260561886/targetingsearch?q=${query}`, (error, response) => {
                    if (error) {
                        console.log(`Error retrieving targeting results for "${query}" : ${JSON.stringify(error)}`)
                        return res.sendStatus(500)
                    } else {
                        console.log(`Retrieved targeting results for "${query}" : ${response.data}`)
                        return res.status(200).send(response.data) 
                    }
                })
    })
            
