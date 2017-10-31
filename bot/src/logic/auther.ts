// Authorizes with Facebook

export default async function auther(req: facebook.Request, res: facebook.Response) {
    console.log(`Authorizing bot with Facebook...`);
    if (
        req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
        res.status(200).send(req.query['hub.challenge']);
        console.log(`Webhook validated!`);
    } else {
        console.log(`Failed validation. Make sure the validation tokens match.`);
        res.status(403).send
    }
};