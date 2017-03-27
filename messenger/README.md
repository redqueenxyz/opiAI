# Facebook Messenger Bot

## Intro

This example project creates a Facebook Messenger bot in a Nodeenvironment via Express, mirroring the quickstart located in [Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) and borrowed straight from the setup on [Glitch](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) with a couple tweaks to work with [Google App Engine](https://cloud.google.com/appengine/docs/). 

The goal of this test is to explore the capabilities of Facebook's Messenger Platform via the Send API, as well experiment with Node environments on Google App Engine. 

## Setup 

This is primarily an echo bot that responds to a user's message by repeating their message back to them, with some added functionality accessible via certain keywords. This project is not dependent on any external libraries for it's core functionality, so it can be easily extended.For more detailed setup instructions, see [Messenger Platform Quick Start](https://developers.facebook.com/docs/messenger-platform/guides/quick-start).

[![asciicast](https://asciinema.org/a/4x9izzb6xxeu1g5xx785tlioa.png)](https://asciinema.org/a/4x9izzb6xxeu1g5xx785tlioa)

This repo is also self-contained for interaction with GAE, and can be accessed via the [GCloud SDK](https://cloud.google.com/sdk/) with appropriate permissions.   This is what has been implemented so far:

- [x] Setting up our [Facebook Page](https://www.facebook.com/Vocal-1226907177358234/) and [Facebook App](https://developers.facebook.com/apps/1864264410512639/dashboard/).

- [x] Copying our app credentials into the `.env` file

- [x] Setting up the [Node/Express server on GAE](https://vocal-162118.appspot.com) with a (working -_-) `/webhook` for callbacks.
 
- [x] Configure your Facebook App with the right messaging permisions, Callback URL and Verify Tokens. 

- [ ] Playing with the new [bot!](https://www.messenger.com/t/feedbackAI/)

## Capabalities

It is now capable of the following functions:
- `sendTextMessage()`: The base protocol (Thanks Facebook) that allows more complex messaging protocols to be created.
- `sendGenericMessage()`: A simple Structured Response example, using the [Generic template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template).
- `sendQuickReply()`:  A simple Quick Reply example, using the [Quick Reply template](https://developers.facebook.com/docs/messenger-platform/send-api-reference/quick-replies).