import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

// Firestore Database
const db = admin.firestore()

// `responses/` endpoint
export const responses = db.collection("responses")

// `survey/` endpoint
export const surveys = db.collection("surveys")

// `users/` endpoint
export const users = db.collection("users")