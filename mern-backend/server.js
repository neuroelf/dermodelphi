// server port
const PORT = 4000;

// import mongo, express, and other requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// create express router for sessions
const sessionRouter = express.Router();

// import model from separate script file
let DMSession = require('./dmSession.model');

// add middle-wares to express app
app.use(cors());
app.use(bodyParser.json());

// connect to database
mongoose.connect('mongodb://127.0.0.1:27017/diagnosis_mapper', { useNewUrlParser: true });
const DMDBConnection = mongoose.connection;
DMDBConnection.once('open', function() {
    console.log('mongodb connection to diagnosis_mapper DB successful.');
});

// create endpoints for getting and setting sessions
sessionRouter.route('/:sessionID').get(function (req, res) {
    let sessionID = req.params.sessionID;
    DMSession.findOne({ sessionID: sessionID }, function(err, session) {
        if (err) {
            console.log(err);
        } else {
            res.json(session);
        }
    });
});
sessionRouter.route('/set').post(function(req, res) {
    let session = new DMSession(req.body);
    session.save()
        .then(session => {
            res.status(200).json()
        });
});

// add session Router to the application
app.use('/session', sessionRouter);

// start server
app.listen(PORT, function() {
    console.log('Server is running on port ' + PORT.toString());
});
