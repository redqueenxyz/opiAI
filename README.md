# feedbackAI

## Intro

This example project creates a Facebook Messenger bot in a Node environment via Express, mirroring the quickstart located in [Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) and built on top of the setup provided on [Glitch](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) with a couple tweaks to play with [Google App Engine](https://cloud.google.com/appengine/docs/). 

The goal of this test is to explore the capabilities of Facebook's Messenger Platform via the Send API, as well experiment with Node environments on Google Container Engine. 

## Setup 


    node v7.10
    body-parser v1.17.1
    express v4.15.3
    firebase v4.2.1
    nodemon: v1.11.0
    request": v2.81.0
    docker v17.03.1-ce
    
This project is also being used to test the **Continous Deployment** paradigm using:
1. Git as the VCS.
2. Mocha for Unit Tests.
3. Docker to containerize the Bot.
4. Codefresh to run automated builds, tests.
5. Google Cloud Container Engine to deploy our latest `master` build. 

The process has not been completely finalized, and continuous to be iteratively improved. 
![](http://www.innova4j.com/wp-content/uploads/2016/10/continuous-delivery-ENG.png)
