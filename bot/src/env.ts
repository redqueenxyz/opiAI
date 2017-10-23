// Package Dependencies
import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/// Config

// Process Environment
dotenv.config()

// Firebase
admin.initializeApp(functions.config().firebase)
