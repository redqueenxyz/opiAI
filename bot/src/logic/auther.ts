// Authorizes the bot with Facebook

// Dependencies
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as logger from 'winston'

export async function auther(req: Request, res: Response) {
  logger.info('\n Authorizing bot with Facebook...');
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === facebook.verifyToken) {
    res.status(200).send(req.query['hub.challenge']);
    logger.info('Webhook validated!');
  } else {
    logger.error('Failed validation. Make sure the validation tokens match.');
    res.status(403).send
  }
};
