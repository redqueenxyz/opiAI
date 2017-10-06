"use strict";
// Runs users through surveys
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Package Dependencies
var firebase_admin_1 = require("firebase-admin");
var logger = require("winston");
// Local Dependencies
var sender_1 = require("./sender");
/** Saves new users in Firebase
 * @param {string} userID - Facebook user ID
 */
function saveUser(userID) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger.info('Saving User %d in the Database...', userID);
            firebase_admin_1.database.ref('users/' + userID).set({
                availableSurveys: {},
            });
            return [2 /*return*/];
        });
    });
}
exports.saveUser = saveUser;
;
/** Checking if the user exists in the database
 * @param {string} userID - Facebook User ID
 */
function userFinder(userID) {
    return __awaiter(this, void 0, void 0, function () {
        var userEntry, userExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info('Checking if we\'ve met User %d before...', userID);
                    return [4 /*yield*/, firebase_admin_1.database.ref('users/' + userID).once('value')];
                case 1:
                    userEntry = _a.sent();
                    userExists = userEntry.exists();
                    // Check if the userID exists
                    if (userExists) {
                        logger.info('We\'ve met User %d before!', userID);
                        surveyChecker(userID);
                    }
                    else {
                        logger.info('Have not met this user!', userID);
                        saveUser(userID)
                            .then(function () {
                            logger.info('Assigning User %d Starter ..', userID);
                            surveyAssigner(userID, 'survey_0', true)
                                .then(function () {
                                logger.info('Sending User %d Starter ..', userID);
                                surveyChecker(userID);
                            })
                                .catch(function (error) {
                                logger.error('Error prompting Starter Survey to User %d', userID);
                            });
                        })
                            .catch(function (error) {
                            logger.error('Error assigning Starter Survey to User %d fai', userID);
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.userFinder = userFinder;
;
/** Assigns a user an available survey
 * @param {string} userID - Facebook User ID
 * @param {string} surveyID - The Survey ID in the DB
 * @param {boolean} current - Make Current Survey? (True for Starter Survey)
 */
function surveyAssigner(userID, surveyID, current) {
    if (current === void 0) { current = false; }
    return __awaiter(this, void 0, void 0, function () {
        var surveyRef, surveyQuestions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info('Assiging User %d Survey %s...', userID, surveyID);
                    return [4 /*yield*/, firebase_admin_1.database.ref('surveys/' + surveyID).once('value')];
                case 1:
                    surveyRef = _a.sent();
                    surveyQuestions = surveyRef.child('questions').numChildren();
                    // Register it as an available survey for the user
                    firebase_admin_1.database.ref('users/' + userID + '/availableSurveys/' + surveyID)
                        .set({
                        postback: surveyID,
                        completed: false,
                        started: false,
                        current: current,
                        currentQuestion: 0,
                        finalQuestion: surveyQuestions - 1,
                        totalQuestions: surveyQuestions,
                    })
                        .catch(function (error) {
                        logger.error('Failed to assign User %d Survey %s', userID, surveyID);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.surveyAssigner = surveyAssigner;
;
/** Starts or Assigns User a Current Survey
* @param {string} userID - Facebook User ID
*/
function surveyChecker(userID) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentSurvey, currentSurveyID, startedCurrentSurvey, _b, availableSurveys, availableSurveyIDs, randomSurveyKey;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logger.info('Checking if User %d has Available Surveys...', userID);
                    return [4 /*yield*/, getCurrentSurvey(userID)];
                case 1:
                    _a = _c.sent(), currentSurvey = _a.currentSurvey, currentSurveyID = _a.currentSurveyID;
                    if (!currentSurvey) return [3 /*break*/, 2];
                    startedCurrentSurvey = currentSurvey[currentSurveyID].started;
                    // const completedCurrentSurvey = currentSurvey[currentSurveyID].completed;
                    if (currentSurvey && !startedCurrentSurvey) {
                        // This means the survey was assigned as active, but not started (usually survey_0)
                        logger.info('User %d has a current survey: %s, but has not started. Starting now and updating state...', userID, currentSurveyID);
                        // Initialize the current Survey State state
                        firebase_admin_1.database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID).update({
                            started: true,
                        })
                            .then(function () {
                            // After that state is updated, now start the user on that Survey
                            surveyLooper(userID);
                        })
                            .catch(function (error) {
                            logger.error('Error in surveyAssigner for User %d & survey: %s!', userID, currentSurveyID);
                        });
                    }
                    else if (currentSurvey && startedCurrentSurvey) {
                        // This means he's already in a survey, and needs to continue looping
                        logger.info('User %d is currently on Survey %s! Handing off to looper...', userID, currentSurveyID);
                        surveyLooper(userID);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    if (!!currentSurvey) return [3 /*break*/, 4];
                    return [4 /*yield*/, getAvailableSurveys(userID)];
                case 3:
                    _b = _c.sent(), availableSurveys = _b.availableSurveys, availableSurveyIDs = _b.availableSurveyIDs;
                    if (availableSurveys) {
                        logger.info('User %d has no current Surveys! Assigning him one at random...', userID);
                        randomSurveyKey = availableSurveyIDs[Math.floor(Math.random() * availableSurveyIDs.length)];
                        logger.info('Setting User %d\'s current Survey to: %s...', userID, randomSurveyKey);
                        firebase_admin_1.database.ref('users/' + userID + '/availableSurveys/' + randomSurveyKey).update({
                            current: true,
                        })
                            .then(function () {
                            surveyChecker(userID);
                        });
                    }
                    else if (!availableSurveys) {
                        logger.info('User %d\'s has no Current or Available Surveys!', userID);
                        sender_1.sendTextMessage(userID, 'I don\'t have any more questions for you! Please come back later.');
                    }
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.surveyChecker = surveyChecker;
;
/** Sends a user a given survey question */
function surveyQuestionSender(userID, surveyID, questionNumber) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger.info('Sending User %d Question %d on Survey: \'%s\'...', userID, questionNumber, surveyID);
            //  Get the Question
            firebase_admin_1.database.ref('surveys/' + surveyID + '/questions').once('value')
                .then(function (snapshot) {
                // Send it to the User
                sender_1.sendMessage(userID, snapshot.val()[questionNumber]);
            });
            return [2 /*return*/];
        });
    });
}
exports.surveyQuestionSender = surveyQuestionSender;
;
function getCurrentSurvey(userID) {
    return __awaiter(this, void 0, void 0, function () {
        var currentSurveyRef, currentSurvey, currentSurveyID, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info('Checking if User %d has Current Survey...', userID);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebase_admin_1.database.ref('users/' + userID + '/availableSurveys').orderByChild('current').equalTo(true).once('value')];
                case 2:
                    currentSurveyRef = _a.sent();
                    currentSurvey = currentSurveyRef.val() == null ? false : currentSurveyRef.val();
                    currentSurveyID = currentSurveyRef.val() == null ? [] : Object.keys(currentSurvey)[0];
                    return [2 /*return*/, { currentSurvey: currentSurvey, currentSurveyID: currentSurveyID }];
                case 3:
                    error_1 = _a.sent();
                    logger.error('Error checking if User %d has Current Survey!', userID);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getCurrentSurvey = getCurrentSurvey;
;
function getAvailableSurveys(userID) {
    return __awaiter(this, void 0, void 0, function () {
        var availableSurveysRef, availableSurveys, availableSurveyIDs, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info('Checking if User %d has Available Surveys...', userID);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, firebase_admin_1.database.ref('users/' + userID + '/availableSurveys').orderByChild('completed').equalTo(false).once('value')];
                case 2:
                    availableSurveysRef = _a.sent();
                    availableSurveys = availableSurveysRef.val() == null ? false : availableSurveysRef.val();
                    availableSurveyIDs = availableSurveysRef.val() == null ? [] : Object.keys(availableSurveys);
                    return [2 /*return*/, { availableSurveys: availableSurveys, availableSurveyIDs: availableSurveyIDs }];
                case 3:
                    error_2 = _a.sent();
                    logger.error('Error checking if User %d has Available Surveys!', userID);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAvailableSurveys = getAvailableSurveys;
;
/** Loops users through their current survey until they are done */
function surveyLooper(userID) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentSurvey, currentSurveyID, startedCurrentSurvey, completedCurrentSurvey, currentQuestion, finalQuestion;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCurrentSurvey(userID)];
                case 1:
                    _a = _b.sent(), currentSurvey = _a.currentSurvey, currentSurveyID = _a.currentSurveyID;
                    logger.info('Looping User %d through Current Survey: %s...', userID, currentSurveyID);
                    startedCurrentSurvey = currentSurvey[currentSurveyID]['started'];
                    completedCurrentSurvey = currentSurvey[currentSurveyID]['completed'];
                    currentQuestion = currentSurvey[currentSurveyID]['currentQuestion'];
                    finalQuestion = currentSurvey[currentSurveyID]['finalQuestion'];
                    if (currentQuestion <= finalQuestion) {
                        // Send them the current question for the current Survey
                        logger.info('Sending User %d Next Question for Survey %s...', userID, currentQuestion, currentSurveyID);
                        surveyQuestionSender(userID, currentSurveyID, currentQuestion);
                    }
                    else {
                        // If the current question is greater than the number of questions available, survey done!
                        logger.info('User %d has completed Survey %s!', userID, currentSurveyID);
                        // Update the available Survey state to complete, and make it inactive
                        firebase_admin_1.database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID).update({
                            completed: true,
                            current: false,
                        })
                            .then(function () {
                            logger.info('Checking if User %d has any other surveys....', userID);
                            surveyChecker(userID);
                        })
                            .catch(function (error) {
                            logger.error('Error checking if User %d has any other surveys....', userID);
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.surveyLooper = surveyLooper;
;
/** Saves Answers in Firebase, and increment user State */
function surveyAnswerSaver(userID, questionPayload, answer) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, currentSurvey, currentSurveyID, nextQuestion;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCurrentSurvey(userID)];
                case 1:
                    _a = _b.sent(), currentSurvey = _a.currentSurvey, currentSurveyID = _a.currentSurveyID;
                    nextQuestion = parseInt(questionPayload) + 1;
                    // Save the users answer using payload text and the new survey ID
                    logger.info('Saving User %d response to Question %d on Survey \'%s\': "%s"', userID, questionPayload, currentSurveyID, answer);
                    firebase_admin_1.database.ref('responses/' + currentSurveyID + '/' + userID + '/' + questionPayload)
                        .set({ answer: answer })
                        .then(function () {
                        logger.info('Increment User %d current Survey State to Question %d on Survey %s...', userID, nextQuestion, currentSurveyID);
                        firebase_admin_1.database.ref('users/' + userID + '/availableSurveys/' + currentSurveyID)
                            .update({
                            currentQuestion: nextQuestion,
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.surveyAnswerSaver = surveyAnswerSaver;
;
