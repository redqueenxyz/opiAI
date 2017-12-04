## functions

Working documentation for Helper functions.

### [interestFinder](https://us-central1-opiai-5276b.cloudfunctions.net/interestFinder)
**Input**: 
* Category :: `string`: The category of Facebook Targeting to search `(adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)`
* Keyword :: `string`: The keyword to use when searching Facebook Targeting `(tbd)`

**Output**: 
* Category :: `string`: The category of Facebook Targeting to search `(adcountry, adeducationschool, adeducationmajor, adlocale, adworkemployer, adkeyword, adzipcode, adgeolocation, audienceinterest)`

**Example**:
[https://us-central1-opiai-5276b.cloudfunctions.net/interestFinder?category=audienceinterest&query=hockey](https://us-central1-opiai-5276b.cloudfunctions.net/interestFinder?category=audienceinterest&query=hockey)

**Documentation**:
* [Facebook Advanced Targeting and Placement](https://developers.facebook.com/docs/marketing-api/targeting-specs)
* [Facebook Basic Targeting](https://developers.facebook.com/docs/marketing-api/buying-api/targeting)

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
```