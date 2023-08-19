const admin = require("firebase-admin");
const serviceAccount = require("../config/firebaseConfig");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount.config),
    storageBucket: "",
});

const bucket = admin.storage().bucket();

module.exports = {
    bucket,
};