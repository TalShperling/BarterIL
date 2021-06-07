const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
admin.initializeApp();

exports.sendNotifications1 = functions.firestore.document('/transactions/{transactionId}').onCreate((snapshot, context) => {
    console.log("Got response");
    functions.logger.log("Hey");
    const original = snapshot.data();
    const accountSid = 'AC7aa4ad969f9cd63cc83c7e2e25616bed';
    const authToken = '38a5d1fba91bea373bc3b100c61f3038';
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