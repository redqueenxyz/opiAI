// Authorizes with Facebook

export default async function auther(req: express.Request, res: express.Response) {
    console.log(`Authorizing bot with Facebook...`);
    if (
        req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
        console.log(`Webhook validated!`);
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.log(`Failed validation. Make sure the validation tokens match.`);
        res.sendStatus(403)
    }
};