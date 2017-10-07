// Saves information to  and from a Database

// Package Dependencies
import * as admin from 'firebase-admin'

// Firestore Database
export const db = admin.firestore()


/// Users
export const users = db.collection("users")

//** Checks DB for User */
export async function metUser(userID: string) {
    console.log('Getting User %d from the Database...', userID);
    return users
        .doc(userID)
        .get()
        .then(snapshot => {
            return snapshot.exists
        })
};

/** Saves new users in Database
 * @param {string} userID - Facebook user ID
 */
export async function saveUser(userID: string) {
    console.log('Saving User %s in the Database...', userID);
    db.collection("users")
        .doc(userID)
        .set({
            firstName: "placeholder"
        })
        .then(ref => {
            console.log('Saved User %s!', userID);
        })
        .catch(error => {
            console.log('ERror saving User %s to Database', userID);
        })
};

export async function getUser(userID: string) {
    console.log('Getting User %d from the Database...', userID);
    users
        .doc(userID)
        .get()
        .then(snapshot => {
            return snapshot.data()
        })
};

/// Surveys
export const surveys = db.collection("surveys")

/** Gets the users current Survey
 * @param {string} userID - Facebook user ID
 */
export async function getSurvey(surveyID: string) {
    console.log('Retrieving Survey %s ...', surveyID);

    return surveys
        .doc(surveyID)
        .get()
        .then(snapshot => {
            return snapshot.data()
        })
};

/** Gets the users current Survey
 * @param {string} userID - Facebook user ID
 */
export async function startSurvey(surveyID: string) {
    console.log('Updating Survey [%s] to "started"...', surveyID);

    return users
        .doc(userID)
        .collection("availableSurveys")
        .doc(surveyID)
        .set({
            started: true
        })
        .then(snapshot => {
            console.log('Updated Survey [%s] to "started"!', surveyID);
            return snapshot.data()
        })
        .catch(error => {
            console.log('Error updating Survey [%s] to "started"!', surveyID, error);
        })
};

/** Gets the users current Survey
 * @param {string} userID - Facebook user ID
 */
export async function getCurrentSurvey(userID: string) {
    console.log('Checking if User %d has Current Survey...', userID);
    return users
        .doc(userID)
        .collection("availableSurveys")
        .where("current", "==", true)
        .get()
        .then(query => {
            let currentSurveyID: string = null
            let currentSurvey: object = null

            query.forEach(element => {
                if (element.exists) {
                    currentSurveyID = element.id
                    currentSurvey = element.data()
                } else {
                }
            })
            return { currentSurvey, currentSurveyID }
        })
        .catch(err => {
            console.log('ERror Checking if User %d has Current Survey:', userID, err);
        })
};

export async function getAvailableSurveys(userID) {
    console.log('Checking if User %d has Available Surveys...', userID);
    return users
        .doc(userID)
        .collection("availableSurveys")
        .get()
        .then(snapshot => {
            let availableSurveys = snapshot.data()
            let availableSurveyIDs = snapshot.id
            console.log('Retrieved Available Surveys for User %d!', userID, availableSurveyIDs);
        })
        .catch(error => {
            console.log('Error checking if User %d has Available Surveys!', userID);
        })
};