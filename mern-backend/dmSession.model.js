const mongoose = require('mongoose');

// create DMSession Schema
const Schema = mongoose.Schema;
let DMSession = new Schema( {
    sessionId: { type: String, required: true },
    sessionDate: { type: Date },
    currentCBlockId: { type: String },
    newAs: { type: [Object], required: true },
    newBs: { type: [Object], required: true },
    newCs: { type: [Object], required: true },
    nextAId:  { type: Number, required: true },
    nextBId: { type: [Number], required: true },
    blocks: { type: Object, required: true }
});

// create index
DMSession.index({ sessionId: 1, sessionDate: 1 }, { unique: true });

// export default DMSession;
module.exports = mongoose.model('DMSession', DMSession);
