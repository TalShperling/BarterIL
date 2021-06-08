const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
admin.initializeApp();

exports.sendUpdateNotifications = functions.firestore.document('/transactions/{transactionId}').onUpdate(async (change, context) => {
    const transactionId = context.params.transactionId;
    functions.logger.log(`Transaction ${transactionId} was updated`);

    const updatedData = change.after.data();

    const ownerId = updatedData.ownerId;
    const traderId = updatedData.traderId;

    const userIdToNotify = ownerId === updatedData.operatedBy ? traderId : ownerId;

    let itemIdOfUserToNotify;

    if (userIdToNotify === traderId) {
        itemIdOfUserToNotify = updatedData.traderItemId;
    } else {
        itemIdOfUserToNotify = updatedData.ownerItemId;
    }

    const userToNotify = await (await admin.firestore().collection('users').doc(userIdToNotify).get()).data();
    const itemOfUserToNotify = await (await admin.firestore().collection('items').doc(itemIdOfUserToNotify).get()).data();

    functions.logger.log(`User is: ${JSON.stringify(userToNotify)}`);
    functions.logger.log(`Item is: ${JSON.stringify(itemOfUserToNotify)}`);

    let userPhoneNumber = userToNotify.phoneNumber;

    if (userPhoneNumber.startsWith("0")) {
        userPhoneNumber = `+972${userPhoneNumber.substring(1)}`;
    }

    functions.logger.log(`Sending message to: ${JSON.stringify(userPhoneNumber)}`);

    const accountSid = functions.config().twilio.accountsid;
    const authToken = functions.config().twilio.authtoken;
    const client = new twilio(accountSid, authToken);

    let message;

    switch (updatedData.status) {
        case (1):
            message = `BarterIL: Hey there ${userToNotify.firstName}!\nWe just wanted to notify you that the your offer regards to ${itemOfUserToNotify.name} was approved :)!.\nEnjoy with your new item!\nFor more information please visit our website at www.BarterIL.com`
            break;
        case (2):
            message = `BarterIL: Hey there ${userToNotify.firstName}!\nWe just wanted to notify you that the your offer regards to ${itemOfUserToNotify.name} was declined :(.\nFor more information please visit our website at www.BarterIL.com`    
            break;
    }

    return client.messages.create({
        from: '+17085017158',
        body: message,
        to: userPhoneNumber
    })
        .then((message) => console.log(message.sid))
        .catch((err) => {
            throw (err);
        });

});

exports.sendCreateNotification = functions.firestore.document('/transactions/{transactionId}').onCreate(async (snapshot, context) => {
    const transactionId = context.params.transactionId;
    functions.logger.log(`Transaction ${transactionId} was created`);

    const createdData = snapshot.data();

    const ownerId = createdData.ownerId;
    const traderId = createdData.traderId;

    const userIdToNotify = ownerId === createdData.operatedBy ? traderId : ownerId;

    let itemIdOfUserToNotify;

    if (userIdToNotify === traderId) {
        itemIdOfUserToNotify = createdData.traderItemId;
    } else {
        itemIdOfUserToNotify = createdData.ownerItemId;
    }

    const userToNotify = await (await admin.firestore().collection('users').doc(userIdToNotify).get()).data();
    const itemOfUserToNotify = await (await admin.firestore().collection('items').doc(itemIdOfUserToNotify).get()).data();

    functions.logger.log(`User is: ${JSON.stringify(userToNotify)}`);
    functions.logger.log(`Item is: ${JSON.stringify(itemOfUserToNotify)}`);

    let userPhoneNumber = userToNotify.phoneNumber;

    if (userPhoneNumber.startsWith("0")) {
        userPhoneNumber = `+972${userPhoneNumber.substring(1)}`;
    }

    functions.logger.log(`Sending message to: ${JSON.stringify(userPhoneNumber)}`);

    const accountSid = functions.config().twilio.accountsid;
    const authToken = functions.config().twilio.authtoken;
    const client = new twilio(accountSid, authToken);

    const message = `BarterIL: Hey there ${userToNotify.firstName}!\nWe just wanted to notify you that you have a new offer regards to your ${itemOfUserToNotify.name}!\nFor more information please visit our website at www.BarterIL.com`

    return client.messages.create({
        from: '+17085017158',
        body: message,
        to: userPhoneNumber
    })
        .then((message) => console.log(message.sid))
        .catch((err) => {
            throw (err);
        });

});