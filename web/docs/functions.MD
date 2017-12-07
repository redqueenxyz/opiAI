<<<<<<< HEAD:bot/src/logic/helper.ts
=======
## functions
>>>>>>> web:web/docs/functions.MD

Working documentation for Helper functions.

<<<<<<< HEAD:bot/src/logic/helper.ts
/// Helper Functions

/**
 * Looks up user data from Facebook on user creation
 */
export let userUpdater = functions.firestore
    .document(`respondents/{userID}`)
    .onCreate(event => {
        const userID: string = event.params.userID
        const userEntry: object = event.data.data();
=======
### [interestFinder](https://us-central1-opiai-5276b.cloudfunctions.net/interestFinder)
**Input**: 
* Category :: `string`: The category of Facebook Targeting to search `(adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)`
* Keyword :: `string`: The keyword to use when searching Facebook Targeting `(tbd)`
>>>>>>> web:web/docs/functions.MD

**Output**: 
* Category :: `string`: The category of Facebook Targeting to search `(adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)`

**Example**:
[https://us-central1-opiai-5276b.cloudfunctions.net/interestFinder?category=audienceinterest&query=hockey](https://us-central1-opiai-5276b.cloudfunctions.net/interestFinder?category=audienceinterest&query=hockey)

**Documentation**:
* [Facebook Advanced Targeting and Placement](https://developers.facebook.com/docs/marketing-api/targeting-specs)
* [Facebook Basic Targeting](https://developers.facebook.com/docs/marketing-api/buying-api/targeting)

<<<<<<< HEAD:bot/src/logic/helper.ts

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
=======
**Code**
```typescript
export let interestFinder = functions.https
    .onRequest((req: express.Request, res: express.Response) => {

        // Basic Targeting Spec (TODO: Under construction...)
        const gender: Number = req.query.gender || 0 // (0 = all (default), = male, 2 = female)
        const age_min: Number = req.query.age_min || 13 // (>= 13)
        const age_max: Number = req.query.age_max || 65 // (=< 65)

        // Advanced Targeting Spec
        const type: String = req.query.category || undefined // (adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)
        const query: String = req.query.query || undefined // (keyword)
>>>>>>> web:web/docs/functions.MD


        // TODO: https://developers.facebook.com/tools/explorer/1881894932060023?method=GET&path=search%3Ftype%3Dadgeolocation%26q%3Dcanada&version=v2.9

        console.log(`Looking up ${keyword} in ${category}`)
        return facebook
            .setVersion("2.11")
            .setAccessToken(process.env.FACEBOOK_PAGE_TOKEN)
<<<<<<< HEAD:bot/src/logic/helper.ts
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
=======
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
```
>>>>>>> web:web/docs/functions.MD
