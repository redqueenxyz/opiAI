
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




export let reachEstimate = functions
    .https
    .onRequest((req: express.Request, res: express.Response) => {
        // console.log((req.query.foo))

        console.log(`act_${process.env.FACEBOOK_AD_ACCOUNT}/`)
        facebook
            .setVersion("2.10")
            .setAccessToken(process.env.FACEBOOK_SANDBOX_TOKEN)
            .get(`act_${process.env.FACEBOOK_AD_ACCOUNT}/`,
            // { currency: 'USD' },
            (response: express.Response, error: express.Error) => {
                try {
                    console.log(response)
                    return res
                } catch (error) {
                    console.log(`Error estimating Reach: ${error}`)
                }
            })
    })
        // console.log(req.body)
        // return res.status(200).send(req.query)

        // return

// fields = [
// ]
// params = {
//     'objective': 'PAGE_LIKES',
//     'status': 'PAUSED',
//     'buying_type': 'AUCTION',
//     'name': 'My Campaign',
// }
// campaign = AdAccount(ad_account_id).create_campaign(
//     fields=fields,
//     params=params,
// )
// print 'campaign', campaign

// campaign_id = campaign.get_id()
// print 'campaign_id:', campaign_id, '\n'

// fields = [
// ]
// params = {
//     'status': 'PAUSED',
//     'targeting': {'geo_locations':{'countries':['US']}},
//     'daily_budget': '1000',
//     'billing_event': 'IMPRESSIONS',
//     'bid_amount': '20',
//     'campaign_id': campaign_id,
//     'optimization_goal': 'PAGE_LIKES',
//     'promoted_object': {'page_id': page_id},
//     'name': 'My AdSet',
// }
// ad_set = AdAccount(ad_account_id).create_ad_set(
//     fields=fields,
//     params=params,
// )
// print 'ad_set', ad_set

// ad_set_id = ad_set.get_id()
// print 'ad_set_id:', ad_set_id, '\n'

// fields = [
// ]
// params = {
//     'body': 'Like My Page',
//     'image_url': 'http://www.facebookmarketingdevelopers.com/static/images/resource_1.jpg',
//     'name': 'My Creative',
//     'object_id': page_id,
//     'title': 'My Page Like Ad',
// }
// creative = AdAccount(ad_account_id).create_ad_creative(
//     fields=fields,
//     params=params,
// )
// print 'creative', creative

// creative_id = creative.get_id()
// print 'creative_id:', creative_id, '\n'

// fields = [
// ]
// params = {
//     'status': 'PAUSED',
//     'adset_id': ad_set_id,
//     'name': 'My Ad',
//     'creative': {'creative_id':creative_id},
// }
// ad = AdAccount(ad_account_id).create_ad(
//     fields=fields,
//     params=params,
// )
// print 'ad', ad

// ad_id = ad.get_id()
// print 'ad_id:', ad_id, '\n'

// fields = [
// ]
// params = {
//     'ad_format': 'DESKTOP_FEED_STANDARD',
// }
// print Ad(ad_id).get_previews(
//     fields=fields,
//     params=params,
// )
