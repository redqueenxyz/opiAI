"use strict";
System.register("bot", ["firebase-functions", "firebase-admin"], function (exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var functions, admin;
    return {
        setters: [
            function (functions_1) {
                functions = functions_1;
            },
            function (admin_1) {
                admin = admin_1;
            }
        ],
        execute: function () {
            admin.initializeApp(functions.config().firebase);
        }
    };
});
System.register("logic/cleaner", ["firebase-admin"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var firebase_admin_1, userID, pageID;
    return {
        setters: [
            function (firebase_admin_1_1) {
                firebase_admin_1 = firebase_admin_1_1;
            }
        ],
        execute: function () {
            userID = event.params.userID || "1178458725593438";
            pageID = process.env.PAGEID || "EAAavks7uF3cBADXbtZAo4BC3nbZCL6IfMHsCPZBn9ZBRQyu9r2KbOkN8YUdclDLHf2QHAw5ZApUl1C9ymhmi9ooRsYWlBySrK0unwizMZAhpVi7NgcMMgl9CsVP2Q8qAsOjMSyosvn0JvLwlpaYZAohb3OM4Xf67yTIHtRcAzUzAQZDZD";
            fetch('https://graph.facebook.com/v2.6/${userID}?fields=first_name,last_name,locale,gender&access_token=${pageID}')
                .then(res => {
                firebase_admin_1.firestore.
                    ref('users/${userID}')
                    .update({
                    firstname: data.first_name,
                    lastname: data.last_name,
                    language: data.locale,
                    gender: data.gender,
                })
                    .then(() => {
                    console.log('successly queried facebook, and updated database!');
                });
            })
                .catch(err => {
                console.error(err);
            });
        }
    };
});
