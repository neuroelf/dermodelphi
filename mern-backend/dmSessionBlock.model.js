const mongoose = require('mongoose');

// create DMSession Schema
const Schema = mongoose.Schema;
let DMSessionBlock = new Schema( {
    sessionId: { type: String, required: true },
    blockId: { type: Number, required: true },
    block: { type: Object, required: true }
});

// create index
DMSessionBlock.index({ sessionId: 1, blockId: 1 }, { unique: true });

// export default DMSession;
module.exports = mongoose.model('DMSessionBlock', DMSessionBlock);
