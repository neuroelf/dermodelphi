// access to mongodb via mongoose
const mongoose = require('mongoose');
// console.log(mongoose);

// connect to diagnosis_mapper DB
mongoose.connect('mongodb://localhost/diagnosis_mapper', { useNewUrlParser: true });
// console.log(mongoose);

// ensure Schema
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const DM_session = new Schema( {
    user: String,
    session: String,
    state: String,
    date: Date
});
// console.log(DM_session);




