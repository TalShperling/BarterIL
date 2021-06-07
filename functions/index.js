const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
admin.initializeApp();

exports.sendNotifications1 = functions.firestore.document('/transactions/{transactionId}').onUpdate((change, context) => {
    console.log("Got response");
    functions.logger.log("Hey");
    const original = change.after.data();
    console.log(original);
    console.log(functions.config().twilio);
    const accountSid = functions.config().twilio.accountsid;
    const authToken = functions.config().twilio.authtoken;
    const client = new twilio(accountSid, authToken);

    console.log(original);

   return client.messages.create({
        from: '+17085017158',
        body: "Hey",
        to: '+972504084477'
    })
        .then((message) => console.log(message.sid))
        .catch((err) => {
            throw (err);
        });

});