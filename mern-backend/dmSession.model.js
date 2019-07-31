const mongoose = require('mongoose');

// create DMSession Schema
const Schema = mongoose.Schema;
let DMSession = new Schema( {
    user: { type: String },
    sessionId: { type: String },
    currentCBlockId: { type: String },
    blocks: { type: Object },
    date: { type: Date }
});

// export default DMSession;
module.exports = mongoose.model('DMSession', DMSession);
