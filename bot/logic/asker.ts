// Runs users through surveys

// Export

// Package Dependencies
const firebase = require('firebase-admin');
const database = firebase.database();
const logger = require('winston');

// Local Dependencies
import sender from 'sender'

/** Saves new users in Firebase 
 * @param {string} userID - Facebook User ID
 */
export async function saveUser(userID: string) {
  logger.info('Saving User %d in the Database...', userID);
  database.ref('users/' + userID).set({
    availableSurveys: {},
  });
};

/** Checking if the user exists in the database
 * @param {string} userID - Facebook User ID
 */
export async function userFinder(userID: string) {
  logger.info('Checking if we\'ve met User %d before...', userID);
  const userEntry = await database.ref('users/' + userID).once('value');
  const userExists = userEntry.exists();
  // Check if the userID exists
  if (userExists) {
    logger.info('We\'ve met User %d before!', userID);
    surveyChecker(userID);
  } else {
    logger.info('Have not met this user!', userID);
    saveUser(userID)
      .then(() => {
        logger.info('Assigning User %d Starter ..', userID);
        surveyAssigner(userID, 'survey_0', true)
          .then(() => {
            logger.info('Sending User %d Starter ..', userID);
            surveyChecker(userID);
          })
          .catch((error) => {
            logger.error('Error prompting Starter Survey to User %d', userID);
          });
      })
      .catch((error) => {
        logger.error('Error assigning Starter Survey to User %d fai', userID);
      });
  }
};

/** Assigns a user an available survey
 * @param {string} userID - Facebook User ID
 * @param {string} surveyID - The Survey ID in the DB
 * @param {boolean} current - Make Current Survey? (True for Starter Survey)
 */
export async function surveyAssigner(userID: string, surveyID: string, current: boolean = false) {
  logger.info('Assiging User %d Survey %s...', userID, surveyID);

  // Lookup survey info
  const surveyRef = await database.ref('surveys/' + surveyID).once('value');
  // const survey = surveyRef.val();
  const surveyQuestions = surveyRef.child('questions').numChildren();


  // Register it as an available survey for the user

  database.ref('users/' + userID + '/availableSurveys/' + surveyID)
    .set({
      postback: surveyID,
      completed: false,
      started: false,
      current: current,
      currentQuestion: 0,
      finalQuestion: surveyQuestions - 1,
      totalQuestions: surveyQuestions,
    })
    .catch((error) => {
      logger.error('Failed to assign User %d Survey %s', userID, surveyID);
    });
};

/** Starts or Assigns User a Current Survey
* @param {string} userID - Facebook User ID
*/
export async function surveyChecker(userID) {
  logger.info('Checking if User %d has Available Surveys...', userID);

  const { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);

  if (currentSurvey) {
    // Get the current Survey state
    const startedCurrentSurvey = currentSurvey[currentSurveyID].started;
    // const completedCurrentSurvey = currentSurvey[currentSurveyID].completed;

    if (currentSurvey && !startedCurrentSurvey) {
      // This means the survey was assigned as active, but not started (usually survey_0)
      logger.info('User %d has a current survey: %s, but has not started. Starting now and updating state...', userID, currentSurveyID);

      // Initialize the current Survey State state
      database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID).update({
        started: true,
      })
        .then(() => {
          // After that state is updated, now start the user on that Survey
          surveyLooper(userID);
        })
        .catch((error) => {
          logger.error('Error in surveyAssigner for User %d & survey: %s!', userID, currentSurveyID);
        });
    } else if (currentSurvey && startedCurrentSurvey) {
      // This means he's already in a survey, and needs to continue looping
      logger.info('User %d is currently on Survey %s! Handing off to looper...', userID, currentSurveyID);
      surveyLooper(userID);
    }
    // If they has a current available Survey that's not intialized, set it up and send him into the Looper
  } else if (!currentSurvey) {
    // No Current, check Available
    const { availableSurveys, availableSurveyIDs } = await getAvailableSurveys(userID);

    if (availableSurveys) {
      logger.info('User %d has no current Surveys! Assigning him one at random...', userID);
      const randomSurveyKey = availableSurveyIDs[Math.floor(Math.random() * availableSurveyIDs.length)];

      logger.info('Setting User %d\'s current Survey to: %s...', userID, randomSurveyKey);
      database.ref('users/' + userID + '/availableSurveys/' + randomSurveyKey).update({
        current: true,
      })
        .then(() => {
          surveyChecker(userID);
        });
    } else if (!availableSurveys) {
      logger.info('User %d\'s has no Current or Available Surveys!', userID);
      sendTextMessage(userID, 'I don\'t have any more questions for you! Please come back later.');
    }
  }
};

/** Sends a user a given survey question */
export async function surveyQuestionSender(userID, surveyID, questionNumber) {
  logger.info('Sending User %d Question %d on Survey: \'%s\'...', userID, questionNumber, surveyID);

  //  Get the Question
  database.ref('surveys/' + surveyID + '/questions').once('value')
    .then((snapshot) => {
      // Send it to the User
      sendMessage(userID, snapshot.val()[questionNumber]);
    });
};

export async function getCurrentSurvey(userID) {
  logger.info('Checking if User %d has Current Survey...', userID);
  try {
    const currentSurveyRef = await database.ref('users/' + userID + '/availableSurveys').orderByChild('current').equalTo(true).once('value');
    const currentSurvey = currentSurveyRef.val() == null ? false : currentSurveyRef.val();
    const currentSurveyID = currentSurveyRef.val() == null ? [] : Object.keys(currentSurvey)[0];
    return { currentSurvey, currentSurveyID };
  } catch (error) {
    logger.error('Error checking if User %d has Current Survey!', userID);
  }
};


export async function getAvailableSurveys(userID) {
  logger.info('Checking if User %d has Available Surveys...', userID);
  try {
    const availableSurveysRef = await database.ref('users/' + userID + '/availableSurveys').orderByChild('completed').equalTo(false).once('value');
    const availableSurveys = availableSurveysRef.val() == null ? false : availableSurveysRef.val();
    const availableSurveyIDs = availableSurveysRef.val() == null ? [] : Object.keys(availableSurveys);

    return { availableSurveys, availableSurveyIDs };
  } catch (error) {
    logger.error('Error checking if User %d has Available Surveys!', userID);
  }
};

/** Loops users through their current survey until they are done */
export async function surveyLooper(userID) {
  // Get the current Survey
  let { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);
  logger.info('Looping User %d through Current Survey: %s...', userID, currentSurveyID);

  // Get current Survey State
  const startedCurrentSurvey = currentSurvey[currentSurveyID]['started'];
  const completedCurrentSurvey = currentSurvey[currentSurveyID]['completed'];
  const currentQuestion = currentSurvey[currentSurveyID]['currentQuestion'];
  const finalQuestion = currentSurvey[currentSurveyID]['finalQuestion'];

  if (currentQuestion <= finalQuestion) {
    // Send them the current question for the current Survey
    logger.info('Sending User %d Next Question for Survey %s...', userID, currentQuestion, currentSurveyID);
    surveyQuestionSender(userID, currentSurveyID, currentQuestion);
  } else {
    // If the current question is greater than the number of questions available, survey done!
    logger.info('User %d has completed Survey %s!', userID, currentSurveyID);

    // Update the available Survey state to complete, and make it inactive
    database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID).update({
      completed: true,
      current: false,
    })
      .then(() => {
        logger.info('Checking if User %d has any other surveys....', userID);
        surveyChecker(userID);
      })
      .catch((error) => {
        logger.error('Error checking if User %d has any other surveys....', userID);
      });
  }
};


/** Saves Answers in Firebase, and increment user State */
export async function surveyAnswerSaver(userID, questionPayload, answer) {
  // Get current Survey
  const { currentSurvey, currentSurveyID } = await getCurrentSurvey(userID);
  const nextQuestion = parseInt(questionPayload) + 1;

  // Save the users answer using payload text and the new survey ID
  logger.info('Saving User %d response to Question %d on Survey \'%s\': "%s"', userID, questionPayload, currentSurveyID, answer);
  database.ref('responses/' + currentSurveyID + '/' + userID + '/' + questionPayload)
    .set({ answer })
    .then(() => {
      logger.info('Increment User %d current Survey State to Question %d on Survey %s...', userID, nextQuestion, currentSurveyID);
      database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID)
        .update({
          currentQuestion: nextQuestion,
        });
    });
};
