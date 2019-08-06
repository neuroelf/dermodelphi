const mongoose = require('mongoose');

// create DMSession Schema
const Schema = mongoose.Schema;
let DMSessionId = new Schema( {
    userEmail: { type: String, required: true },
    sessionId: { type: String, required: true, index: true, unique: true }
});

// export default DMSession;
module.exports = mongoose.model('DMSessionId', DMSessionId);
