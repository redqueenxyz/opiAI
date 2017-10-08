// Runs users through surveys

// Package Dependencies
import { database } from 'firebase-admin'

// Local Dependencies
import { sendMessage, sendTextMessage } from './sender'
import { users, metUser, saveUser } from './getsetter'
import { surveys, getSurvey, getSurveyQuestion, getCurrentSurvey, completeSurvey, getAvailableSurveys, saveResponse } from './getsetter'

/** Checking if the user exists in the database
 * @param {string} userID - Facebook User ID
 */
export async function whichUser(userID: string) {
  console.log(`Checking if we\'ve met ${userID} before...`)
  const userExists: boolean = await metUser(userID)

  if (userExists) {
    console.log(`Met ${userID} before!`)
    surveyChecker(userID);
  } else {
    console.log(`Have not met ${userID} before!`)
    saveUser(userID)
      .then(() => {
        console.log(`Assigning ${userID} the Starter Survey...`)

        surveyAssigner(userID, 'survey_1')

        surveyAssigner(userID, 'survey_0', true)
          .then(() => {
            console.log(`Sending ${userID} the Starter Survey..`)
            surveyChecker(userID)
              .then(() => {
                console.log(`Error sending  Starter Survey to ${userID}`)
              })
          })
      });
  }
}

/** Assigns a user an available survey
 * @param {string} userID - Facebook User ID
 * @param {string} surveyID - The Survey ID in the DB
 * @param {boolean} current - Make Current Survey? (True for Starter Survey)
 */
export async function surveyAssigner(userID: string, surveyID: string, current: boolean = false) {
  console.log(`Assigning ${userID} ${surveyID}...`);

  // Lookup survey info
  const survey = await getSurvey(surveyID)
  const surveyQuestions = survey["questions"].length;

  // Assign Survey
  users
    .doc(userID)
    .collection("availableSurveys")
    .doc(surveyID)
    .set({
      completed: false,
      current: current,
      currentQuestion: 0,
      finalQuestion: surveyQuestions - 1,
      totalQuestions: surveyQuestions,
    })
    .then(() => {
      console.log(`Successfully assigned ${userID} Survey ${surveyID}`)
    })
    .catch(error => {
      console.log(`Failed to assign ${userID} Survey ${surveyID}`)
    });
};

/** Starts or Assigns User a Current Survey
* @param {string} userID - Facebook User ID
*/
export async function surveyChecker(userID: string) {
  console.log(`Checking if ${userID} is on a Survey...`)

  let currentSurveyCheck = await getCurrentSurvey(userID);
  let availableSurveyCheck = await getAvailableSurveys(userID);

  let currentSurvey: object = currentSurveyCheck.currentSurvey
  let availableSurveys: object[] = availableSurveyCheck.availableSurveys

  let currentSurveyID: string = currentSurveyCheck.currentSurveyID
  let availableSurveyIDs: string[] = availableSurveyCheck.availableSurveyIDs

  const completedCurrentSurvey = currentSurvey.completed;

  if (!completedCurrentSurvey) {
    console.log(`${userID} has Current Survey ${currentSurveyID}. Looping...`)
    surveyLooper(userID);
  } else if (!!completedCurrentSurvey && availableSurveyIDs) {
    // No current survey, check for available surveys

    const randomSurveyID = availableSurveyIDs[Math.floor(Math.random() * availableSurveyIDs.length)];

    console.log(`${userID} has no current Surveys! Assigning them ${randomSurveyID} at random...`)

    surveyAssigner(userID, randomSurveyID, true)
      .then(() => {
        console.log(`Succesfully assigned ${userID} ${randomSurveyID}!`)
        surveyChecker(userID)
      })
      .catch(err => {
        console.log(`Error assigning ${randomSurveyID} to ${userID}: ${err}!`)
      })
  } else {
    console.log(`${userID}\'s has no Current or Available Surveys!`)
    sendTextMessage(userID, 'I don\'t have any more questions for you right now! Please come back later.');

    // TODO: (feat): Send user a random question from https://opentdb.com/api_config.php
  };
}

/** Loops users through their current survey until they are done */
export async function surveyLooper(userID: string) {
  // Get the current Survey
  let currentSurveyCheck = await getCurrentSurvey(userID);

  let currentSurvey: object = currentSurveyCheck.currentSurvey
  let currentSurveyID: string = currentSurveyCheck.currentSurveyID
  // Log
  console.log(`Looping ${userID} through Current Survey ${currentSurveyID}...`);

  // Get the current Survey state
  const completedCurrentSurvey = currentSurvey.completed;

  if (!completedCurrentSurvey) {
    // This means the survey was assigned as active, but not started (usually survey_0)
    console.log(`${userID} has Current Survey ${currentSurveyID}`)

    // Get current Survey State
    const currentQuestion = currentSurvey.currentQuestion
    const finalQuestion = currentSurvey.finalQuestion

    if (currentQuestion <= finalQuestion) {
      // Send them the current question for the current Survey
      console.log(`Sending ${userID} next question ${currentQuestion} for ${currentSurveyID}`)
      surveySender(userID, currentSurveyID, currentQuestion);
    } else {
      // If the current question is greater than the number of questions available, survey done!
      console.log(`${userID} has completed Survey ${currentSurveyID}!`)
      completeSurvey(userID, currentSurveyID)
        .then(() => {
          console.log(`Checking if ${userID} has any other surveys....`)
          surveyChecker(userID);
        })
    }
  }
}

/** Sends a user a given survey question */
export async function surveySender(userID: string, surveyID: string, currentQuestion: number) {

  let currentSurveyCheck = await getCurrentSurvey(userID);

  let currentSurvey: object = currentSurveyCheck.currentSurvey
  let currentSurveyID: string = currentSurveyCheck.currentSurveyID
  // Log
  console.log(`Sending User ${userID} Question ${currentQuestion} on ${currentSurveyID}...`);

  //  Get the Question
  const question = await getSurveyQuestion(currentSurveyID, currentQuestion)
  sendMessage(userID, question);
};

/** Saves Answers in Firebase, and increment user State */
export async function surveySaver(userID: string, questionNumber: number, answer: string) {
  // Get current Survey
  let currentSurveyCheck = await getCurrentSurvey(userID);

  let currentSurvey: object = currentSurveyCheck.currentSurvey
  let currentSurveyID: string = currentSurveyCheck.currentSurveyID

  // Log
  console.log(`Receieved ${userID}'s response ${answer} to ${questionNumber} on ${currentSurveyID}...`)
  saveResponse(userID, currentSurveyID, questionNumber, answer)
    .then(() => {
      console.log(`Increment ${userID} Question state from ${questionNumber} to ${questionNumber + 1} on ${currentSurveyID}`)

      // Increment Current Survey Question 
      users
        .doc(userID)
        .collection("availableSurveys")
        .doc(currentSurveyID)
        .update({
          currentQuestion: questionNumber + 1
        })
        .catch(error => {
          console.log(`Error increment ${userID} Question state from ${questionNumber} to ${questionNumber + 1} on ${surveyID}: ${error}`)
        })
    })
};
