// Saves information to  and from a Database

// Package Dependencies
import * as admin from 'firebase-admin'

// Firestore Database
export const db = admin.firestore()


/// Users -------------------------------------------------------------
export const users = db.collection("users")

/**
 * @param {string} userID - Facebook User Id
 */
export async function metUser(userID: string) {
    console.log(`Checking if ${userID} exists in Database...`);
    return users
        .doc(userID)
        .get()
        .then(snapshot => {
            return snapshot.exists
        })
        .catch(error => {
            console.log(`Error checking if ${userID} in Database`);
        })
};

/** Saves new users in Database
 * @param {string} userID - Facebook user ID
 */
export async function saveUser(userID: string) {
    console.log(`Saving ${userID} in the Database...`);
    return users
        .doc(userID)
        .set({
            metUser: true
        })
        .then(ref => {
            console.log(`Saved ${userID}!`);
        })
        .catch(error => {
            console.log(`Error saving ${userID} to Database`);
        })
};

export async function getUser(userID: string) {
    console.log(`Getting ${userID} from the Database...`);
    users
        .doc(userID)
        .get()
        .then(snapshot => {
            return snapshot.data()
        })
        .catch(error => {
            console.log(`Error saving ${userID} to Database`);
        })
};

/// Surveys -------------------------------------------------------------
export const surveys = db.collection("surveys")

export async function getAvailableSurveys(userID: string) {
    console.log(`Checking if ${userID} has Available Surveys...`);
    return users
        .doc(userID)
        .collection("availableSurveys")
        .where("completed", "==", false)
        .where("current", "==", false)
        .get()
        .then(query => {

            let availableSurveys: object[] = []
            let availableSurveyIDs: string[] = []

            query.forEach(element => {
                availableSurveys.push(element.data())
                availableSurveyIDs.push(element.id)
            })

            console.log(`Retrieved ${availableSurveyIDs} for ${userID}!`)

            // return an Object holding the Available Surveys and IDs
            return { availableSurveys, availableSurveyIDs }
        })
        .catch(error => {
            console.log(`Error checking if ${userID} has Available Surveys!`, error);
        })
};


/** Gets a survey from Firestore
 * @param {string} userID - Facebook user ID
 */
export async function getSurvey(surveyID: string) {
    console.log(`Retrieving ${surveyID} ...`);

    return surveys
        .doc(surveyID)
        .get()
        .then(snapshot => {
            console.log(`Retrieved ${surveyID}: ${snapshot.data()}`)
            return snapshot.data()
        })
        .catch(error => {
            console.error(`Error retrieving ${surveyID}: ${error.stack}`);
        })
};

/** Gets the users current Survey Question
 * @param {string} userID - Facebook user ID
 */
export async function getSurveyQuestion(surveyID: string, questionNumber: number) {
    console.log(`Retrieving Question ${questionNumber} from Survey ${surveyID} ...`);

    return surveys
        .doc(surveyID)
        .get()
        .then(snapshot => {
            let questions = snapshot.data().questions
            return questions[questionNumber]
        })
        .catch(error => {
            console.log(`Error retrieving Question ${questionNumber} from Survey ${surveyID}`);
        })
};

/** Gets the users current Survey
 * @param {string} userID - Facebook user ID
 */
export async function getCurrentSurvey(userID: string) {
    console.log(`Checking Current Survey for ${userID}`)
    return users
        .doc(userID)
        .collection("availableSurveys")
        .where("current", "==", true)
        .get()
        .then(query => {
            let currentSurveyID: string = ""
            let currentSurvey: object = {}

            query.forEach(element => {
                currentSurveyID = element.id
                currentSurvey = element.data()
            })

            // return the Current Survey ID object, and it's ID
            return { currentSurvey, currentSurveyID }
        })
        .catch(err => {
            console.log(`Error Checking if ${userID} has Current Survey: ${err}`)
        })
};

/** Completes the users current Survey
 * @param {string} userID - Facebook user ID
 * @param {string} surveyID - Survey ID
 */
export async function completeSurvey(userID: string, surveyID: string) {
    console.log(`Updating ${userID}'s survey "${surveyID}" to "completed"...`);

    users
        .doc(userID)
        .collection("availableSurveys")
        .doc(surveyID)
        .update({
            completed: true,
            current: false
        })
        .catch(error => {
            console.log(`Error updating ${userID} survey ${surveyID} to "completed"!`, error);
        })
};


/// Responses -------------------------------------------------------------
export const responses = db.collection("responses")

export async function getResponses(surveyID: string) {
    console.log(`Retrieving all responses to ${surveyID}...`);

    return surveys
        .doc(surveyID)
        .get()
        .then(async snapshot => {
            let finalQuestion: Number = snapshot.data().questions.length - 1
            let allAnswers: object[] = []

            for (var question = 0; question < finalQuestion; question++) {
                let response = await getResponse(surveyID, question)
                allAnswers.push(response)
            }

            console.log(`Retrieved all ${surveyID} Responses: ${JSON.stringify(allAnswers)}`)
            return allAnswers
        })
        .catch(error => {
            console.error(`Error retrieving ${surveyID} answers to question ${questionID}: ${error}`)
        })
}

getResponses("survey_0")

/**
 * 
 * @param surveyID 
 * @param questionNumber 
 */
export async function getResponse(surveyID: string, questionNumber: Number) {
    console.log(`Retrieving users who responded to question ${questionNumber} on ${surveyID}...`);

    const questionID: string = String(questionNumber)

    return responses
        .doc(surveyID)
        .collection("questionAnswered")
        .doc(questionID)
        .collection("respondents")
        .get()
        .then(snapshot => {
            let answers: object[] = []

            snapshot.forEach(doc => {
                answers.push({ userID: doc.id, answer: doc.data().answer })
            });

            console.log(`Retrieved ${surveyID} answers to question ${questionID}: ${JSON.stringify(answers)}`)
            return answers
        })
        .catch(error => {
            console.error(`Error retrieving ${surveyID} answers to question ${questionID}: ${error}`)
        })
}


/**
 * 
 * @param userID 
 * @param surveyID 
 * @param questionNumber 
 * @param answer 
 */
export async function saveResponse(userID: string, surveyID: string, questionNumber: number, answer: string) {
    const questionID: string = String(questionNumber)

    console.log(`Saving ${userID}'s response "${answer}" to ${questionID} on ${surveyID}...`)

    return responses
        .doc(surveyID)
        .collection("questionAnswered")
        .doc(questionID)
        .collection("respondents")
        .doc(userID)
        .set({
            answer: answer
        })
        .then(ref => {
            console.log(`Saved ${userID}'s response to ${questionID} on ${surveyID}`)
        })
        .catch(err => {
            console.error(`Error saving ${userID}'s response to ${questionID} on ${surveyID}: ${err}`)
        })
};
