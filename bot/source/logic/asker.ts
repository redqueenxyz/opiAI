// Runs users through surveys

// Package Dependencies
import { database } from 'firebase-admin'

// Local Dependencies
import { sendMessage, sendTextMessage } from './sender'
import { users, metUser, saveUser } from './getsetter'
import { surveys, getCurrentSurvey, getSurvey, getAvailableSurveys, startSurvey } from './getsetter'

/** Checking if the user exists in the database
 * @param {string} userID - Facebook User ID
 */
export async function whichUser(userID: string) {
  console.log('Checking if we\'ve met User %d before...', userID);
  const userExists: boolean = await metUser(userID)

  if (userExists) {
    console.log('We\'ve met User %d before!', userID);
    surveyChecker(userID);
  } else {
    console.log('Have not met this user!', userID);
    saveUser(userID)
      .then(() => {
        console.log('Assigning User %d [survey_0]...', userID);
        surveyAssigner(userID, 'survey_0', true)
          .then(() => {
            console.log('Sending User %d Starter ..', userID);
            surveyChecker(userID)
              .then(() => {
                console.log('Error prompting Starter Survey to User %d', userID);
              })
          })
      });
  }
})
};

/** Assigns a user an available survey
 * @param {string} userID - Facebook User ID
 * @param {string} surveyID - The Survey ID in the DB
 * @param {boolean} current - Make Current Survey? (True for Starter Survey)
 */
export async function surveyAssigner(userID: string, surveyID: string, current: boolean = false) {
  console.log('Assiging User %d Survey %s...', userID, surveyID);

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
      started: false,
      current: current,
      currentQuestion: 0,
      finalQuestion: surveyQuestions - 1,
      totalQuestions: surveyQuestions,
    })
    .then(() => {
      console.log('Successfully assigned User %d Survey %s', userID, surveyID);
    })
    .catch(error => {
      console.log('Failed to assign User %d Survey %s', userID, surveyID);
    });
};

/** Starts or Assigns User a Current Survey
* @param {string} userID - Facebook User ID
*/
export async function surveyChecker(userID: string) {
  console.log('Checking what Survey User %d is on a Surey...', userID);

  const { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);

  if (currentSurvey) {
    console.log('User %s has current survey! [%s]!', userID, currentSurveyID);

    // Get the current Survey state
    const startedCurrentSurvey = currentSurvey.started;
    const completedCurrentSurvey = currentSurvey.completed;

    if (!startedCurrentSurvey) {
      // This means the survey was assigned as active, but not started (usually survey_0)
      console.log('User %d has a current survey [%s], but has not started. Starting now and updating state...', userID, currentSurveyID);

      // Initialize the current Survey State state
      startSurvey(currentSurveyID)
        .then(() => {
          // After that state is updated, now start the user on that Survey
          surveyLooper(userID);
        })
    } else if (!completedCurrentSurvey) {
      // This means he's already in a survey, and needs to continue looping
      console.log('User %d is currently on Survey [%s]! Handing off to looper...', userID, currentSurveyID);
      surveyLooper(userID);
    }
  } else {
    // No Current, check Available
    console.log(' User %d has no Current Survey...', userID);
    const { availableSurveys, availableSurveyIDs } = await getAvailableSurveys(userID);
  }
  //   if (availableSurveys) {
  //     console.log('User %d has no current Surveys! Assigning him one at random...', userID);
  //     const randomSurveyKey = availableSurveyIDs[Math.floor(Math.random() * availableSurveyIDs.length)];

  //     console.log('Setting User %d\'s current Survey to: %s...', userID, randomSurveyKey);
  //     database.ref('users/' + userID + '/availableSurveys/' + randomSurveyKey).update({
  //       current: true,
  //     })
  //       .then(() => {
  //         surveyChecker(userID);
  //       });
  //   } else if (!availableSurveys) {
  //     console.log('User %d\'s has no Current or Available Surveys!', userID);
  //     sendTextMessage(userID, 'I don\'t have any more questions for you! Please come back later.');
  //   }
  // }
};

/** Sends a user a given survey question */
export async function surveyQuestionSender(userID, surveyID, questionNumber) {
  console.log('Sending User %d Question %d on Survey: \'%s\'...', userID, questionNumber, surveyID);

  //  Get the Question
  database.ref('surveys/' + surveyID + '/questions').once('value')
    .then((snapshot) => {
      // Send it to the User
      sendMessage(userID, snapshot.val()[questionNumber]);
    });
};

/** Loops users through their current survey until they are done */
export async function surveyLooper(userID) {
  // Get the current Survey
  let { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);
  console.log('Looping User %d through Current Survey: %s...', userID, currentSurveyID);

  // Get current Survey State
  const startedCurrentSurvey = currentSurvey[currentSurveyID]['started'];
  const completedCurrentSurvey = currentSurvey[currentSurveyID]['completed'];
  const currentQuestion = currentSurvey[currentSurveyID]['currentQuestion'];
  const finalQuestion = currentSurvey[currentSurveyID]['finalQuestion'];

  if (currentQuestion <= finalQuestion) {
    // Send them the current question for the current Survey
    console.log('Sending User %d Next Question for Survey %s...', userID, currentQuestion, currentSurveyID);
    surveyQuestionSender(userID, currentSurveyID, currentQuestion);
  } else {
    // If the current question is greater than the number of questions available, survey done!
    console.log('User %d has completed Survey %s!', userID, currentSurveyID);

    // Update the available Survey state to complete, and make it inactive
    database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID).update({
      completed: true,
      current: false,
    })
      .then(() => {
        console.log('Checking if User %d has any other surveys....', userID);
        surveyChecker(userID);
      })
      .catch((error) => {
        console.log('Error checking if User %d has any other surveys....', userID);
      });
  }
};


/** Saves Answers in Firebase, and increment user State */
export async function surveyAnswerSaver(userID, questionPayload, answer) {
  // Get current Survey
  const { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);
  const nextQuestion = parseInt(questionPayload) + 1;

  // Save the users answer using payload text and the new survey ID
  console.log('Saving User %d response to Question %d on Survey \'%s\': "%s"', userID, questionPayload, currentSurveyID, answer);
  database.ref('responses/' + currentSurveyID + '/' + userID + '/' + questionPayload)
    .set({ answer })
    .then(() => {
      console.log('Increment User %d current Survey State to Question %d on Survey %s...', userID, nextQuestion, currentSurveyID);
      database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID)
        .update({
          currentQuestion: nextQuestion,
        });
    });
};
