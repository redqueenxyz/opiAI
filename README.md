# feedbackAI

## Intro

This project is the Docker image for a NodeJS Facebook Messenger bot running on Google App Engine. It was originally from the quickstart template providded by [Messenger Platform docs](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) on [Glitch](https://developers.facebook.com/docs/messenger-platform/guides/quick-start), but has since grown quite a bit. 

## Goal
Build a responsive, engaging Messenger bot experience centered around acquiring feedback from Facebook users for data collection, human intelligence collection, and artifical intelligent agent training. This (rudimentry) demo can currently ask you how you feel about the [Tesla M3](https://www.tesla.com/en_CA/model3): 

![](bot.gif)

## Dependencies  

    node v7.10
    docker v17.03.1-ce
    body-parser v1.17.1
    express v4.15.3
    firebase v4.2.1
    nodemon: v1.11.0
    request": v2.81.0
    
This project is also being used to test the **Continous Deployment** paradigm using:
1. Git as the VCS.
2. Mocha for Unit Tests.
3. Docker to containerize the Bot.
4. Google App Engine with a `custom:flex` runtime to deploy our Docker container. 

![](http://www.innova4j.com/wp-content/uploads/2016/10/continuous-delivery-ENG.png)

Further elements of this cycle will be implemented as the bot develops. 