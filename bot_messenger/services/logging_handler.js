// This script handles logging the recieved objects ==

// Export
var logging_handler = module.exports = {};


logging_handler.recieveObject = function (req) {
    console.log('\n' + 'We have recieved a request!\n    The body is:\n');
    console.log(req.body);

    var data = req.body;


    // Make sure this is a page subscription; the Page subscription under Products > Messenger > Settings is switched on to the right page
    if (data.object === 'page') {

        // Tell the console
        console.log('\n' + 'It is a page object...\n    ');

        data.entry.forEach(function (entry) {

            // More pretty printing
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            console.log('    The page is ' + pageID + '.') // TODO: Pass this to Firebase
            console.log('    The time is ' + Date(timeOfEvent).toString("MMM dd") + '.'); // TODO: Pass this to Firebase

            // Iterate over each entry - there may be multiple if batched
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    // If it has a message component, run recievedMessage()
                    console.log('\nIt has a message event, pass to message_handler')
                    message_handler.receivedMessage(event);

                } else if (event.postback) {
                    // if it has a postback component, run recievedPostback()
                    console.log('It has a postback event, pass to postback_handler')
                    postback_handler.receivedPostback(event);

                } else if (event.payload) {
                    // if it has a postback component, run recievedPostback()
                    console.log('It has a payload event, pass to payload_handler')
                    payload_handler.recievedPayload(event);
                } else {
                    console.log("It is an unknown event: ", event);
                }
            });
        });
    }
};


// Loca