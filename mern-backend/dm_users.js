// imports
var md5 = require('md5');
var md5salt = require('./md5salt');

// list of users
const dm_users = [
    'liopyrik@mskcc.org',
    'rotembev@mskcc.org',
    'scopea1@gmail.com',
    'weberj3@mskcc.org'
];

// function that computes a value between 0 and 999999 for each email
function emailToId(email) {
    var emailHash = md5(email.toLowerCase() + md5salt.md5salt);
    var hashPos = 0;
    var hashVal = 1000000;
    while (hashVal > 999999) {
        hashVal = parseInt(emailHash.substr(hashPos, 5), 16);
        hashPos++;
    }
    return hashVal;
}

// function that accepts the DMSessionId schema to find and insert users
async function setupUsers(DMSessionId, DMSession) {

    // look up existing users in the database
    const query = DMSessionId.find({});
    const existingUsers = await query.exec();
    const skipUsers = {};
    existingUsers.map(user => skipUsers[user.userEmail.toLowerCase()] = true);

    // then add any non-existing user
    dm_users.map(newUser => {
        if (!(newUser.toLowerCase() in skipUsers)) {
            var userEmailHash = emailToId(newUser);
            var newUserEntry = new DMSessionId({
                userEmail: newUser.toLowerCase(),
                sessionId: userEmailHash
            });
            newUserEntry.save(function(err) {
                if (err) console.log(err);
            });
            var newUserData = new DMSession({
                sessionId: userEmailHash,
                sessionDate: Date.now(),
                currentCBlockId: 0,
                newAs: [],
                newBs: [],
                newCs: [],
                nextAId: 1,
                nextBId: []
            });
            newUserData.save(function(err) {
                if (err) console.log(err);
            });
        }
    });
}

module.exports.dm_users = dm_users;
module.exports.emailToId = emailToId;
module.exports.setupUsers = setupUsers;
