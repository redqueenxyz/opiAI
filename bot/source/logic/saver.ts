// Saves to and from a Database

// Package Dependencies
import * as admin from 'firebase-admin'

// Firestore Database
export const db = admin.firestore()

/** Saves new users in Database
 * @param {string} userID - Facebook user ID
 */
export async function saveUser(userID: string) {
    console.log('Saving User %d in the Database...', userID);
    db.collection("users")
        .doc(userID)
        .set({
            availableSurveys: {},
        });
};
