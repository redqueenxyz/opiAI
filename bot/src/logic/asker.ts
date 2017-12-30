// Runs respondents through surveys

// Package Dependencies
import { database } from 'firebase-admin'

// Local Dependencies
import { sendMessage, sendTextMessage } from './sender'
import { respondents, metRespondent, saveRespondent } from './getsetter'
import { surveys, getSurvey, getSurveyQuestion, getCurrentSurvey, completeSurvey, getAvailableSurveys, saveResponse } from './getsetter'

/** Checking if the user exists in the database
 * @param {string} userID - Facebook User ID
 */
export async function whichUser(userID: string) {
  console.log(`Checking if we\'ve met ${userID} before...`)

  if (metRespondent(userID)) {
    console.log(`Met ${userID} before!`)
    surveyChecker(userID);
  } else {
    console.log(`Have not met ${userID} before!`)
    saveRespondent(userID)
      .then(() => {
        console.log(`Assigning ${userID} the Starter Survey: survey_0...`)
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

  // Assign Survey
  return respondents
    .doc(userID)
    .collection("availableSurveys")
    .doc(surveyID)
    .set({
      completed: false,
      current: current,
      currentQuestion: 0,
      finalQuestion: survey["questions"].length - 1,
      totalQuestions: survey["questions"]
    })
    .then(() => {
      console.log(`Successfully assigned ${userID} Survey ${surveyID}`)
    })
    .catch(error => {
      console.log(`Failed to assign ${userID} Survey ${surveyID}: ${error}`)
    });
};

/** Starts or Assigns User a Current Survey
* @param {string} userID - Facebook User ID
*/
export async function surveyChecker(userID: string) {
  console.log(`Checking if ${userID} is on a Survey...`)

  let { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);
  let { availableSurveys, availableSurveyIDs } = await getAvailableSurveys(userID);

  let hasCurrentSurvey: number = currentSurveyID.length
  let hasAvailableSurveys: number = availableSurveyIDs.length

  if (hasCurrentSurvey) {
    console.log(`${userID} has Current Survey ${currentSurveyID}. Looping...`)
    surveyLooper(userID);
  } else if (!hasCurrentSurvey && hasAvailableSurveys) {
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

/** Loops respondents through their current survey until they are done */
export async function surveyLooper(userID: string) {
  // Get the current Survey
  let { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);

  // Log
  console.log(`Looping ${userID} through Current Survey "${currentSurveyID}"...`);

  // Get the current Survey state
  const completedCurrentSurvey = currentSurvey.completed;

  if (!completedCurrentSurvey) {
    // This means the survey was assigned as active, but not started (usually survey_0)
    console.log(`${userID} has not yet completed Current Survey "${currentSurveyID}"`)

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
/**
 * 
 * 
 * @export
 * @param {string} userID 
 * @param {string} surveyID 
 * @param {number} currentQuestion 
 */
export async function surveySender(userID: string, surveyID: string, currentQuestion: number) {

  let { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);

  // Log
  console.log(`Sending User ${userID} Question ${currentQuestion} on ${currentSurveyID}...`);

  //  Get the Question
  const question = await getSurveyQuestion(currentSurveyID, currentQuestion)
  sendMessage(userID, question);
};


export async function surveySaver(userID: string, questionNumber: number, answer: string) {
  // Get current Survey
  let { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);

  // Log
  console.log(`Receieved ${userID}'s response ${answer} to ${questionNumber} on ${currentSurveyID}...`)
  return saveResponse(userID, currentSurveyID, questionNumber, answer)
    .then(() => {
      console.log(`Increment ${userID} Question state from ${questionNumber} to ${questionNumber + 1} on ${currentSurveyID}`)

      // Increment Current Survey Question 
      respondents
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
