const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

const twilio = require("twilio");

const accountSid = "AC7aa4ad969f9cd63cc83c7e2e25616bed";
const authToken = "c3b7e33ffb0b9e0df8aaa40d97108b40";

const client = new twilio(accountSid, authToken);

const twilioNumber = "+17085017158";

/// Validate E163 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num);
}

exports.textStatus = functions.database.ref('/transactions/{transactionKey}/status').onUpdate(event => {
    const transactionKey = event.params.transactionKey;
    console.log(transactionKey);

    return admin.database().ref(`/transactions/${transactionKey}`)
        .once('value')
        .then(snapshot => snapshot.val())
        .then(transaction => {
            const status = transaction.status;
            const ownerId = transaction.ownerId;
            const traderId = transaction.traderId;
            console.log("Hey");
            let promiseOwner = admin.database().ref(`/users/${ownerId}`)
                .once('value')
                .then(snapshot => snapshot.val());

            let promiseTrader = admin.database().ref(`/users/${traderId}`)
                .once('value')
                .then(snapshot => snapshot.val());

            return Promise.all([promiseOwner, promiseTrader]).then(values => {
                const owner = values[0];
                const trader = values[1];
                const ownerNumber = owner.phoneNumber;
                const traderNumber = trader.phoneNumber;

                if (!validE164(ownerNumber) || !validE164(traderNumber)) {
                    throw new Error('number must be E164 format!');
                }

                let messageToSent;
                let numberToSent;

                switch (status) {
                    case (0):
                        messageToSent = "BarterIL: You have got new offer!\nPlease go to barteril.com for more information"
                        numberToSent = traderNumber;
                        break;
                    case (1):
                        messageToSent = "BarterIL: Your offer was accepted!\nPlease go to barteril.com for more information"
                        numberToSent = ownerNumber;
                        break;
                    case (2):
                        messageToSent = "BarterIL: Your offer was declined!\nPlease go to barteril.com for more information"
                        numberToSent = ownerNumber;
                        break;
                }
                const textMessage = {
                    body: messageToSent,
                    to: numberToSent,
                    from: twilioNumber
                }

                return client.messages.create(textMessage);
            }).then(message => console.log(message.sid, 'success'));
        })
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
