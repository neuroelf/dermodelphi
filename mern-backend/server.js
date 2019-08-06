// server port
const PORT = 4000;

// import mongo, express, and other requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// create express router for sessions
const checkRouter = express.Router();
const sessionRouter = express.Router();

// import model from separate script file
let DMSession = require('./dmSession.model');
let DMSessionId = require('./dmSessionId.model');

// add middle-wares to express app
app.use(cors());
app.use(bodyParser.json());

// connect to database
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://127.0.0.1:27017/diagnosis_mapper', { useNewUrlParser: true });
const DMDBConnection = mongoose.connection;
DMDBConnection.once('open', function() {
    console.log('mongodb connection to diagnosis_mapper DB successful.');
});

// create endpoint for confirming user to email
checkRouter.route('/:userEmail/:sessionId').get(function (req, res) {
    let userEmail = req.params.userEmail;
    let sessionId = req.params.sessionId;
    DMSessionId.findOne({ userEmail: userEmail, sessionId: sessionId }, function(err, session) {
        console.log(JSON.stringify(session));
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.json({ error: err });
        } else {
            if (session === null) {
                res.json({ error: 'SESSION_NOT_FOUND' });
            } else {
                res.json(session);
            }
        }
    });
});

// create endpoints for getting and setting sessions
sessionRouter.route('/:sessionId(\d+)').get(function (req, res) {
    let sessionId = req.params.sessionId;
    DMSession.findOne({ sessionId: sessionId }, function(err, session) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            res.end(JSON.stringify({ error: err }));
        } else {
            console.log('log');
            res.json(session);
        }
    });
});
sessionRouter.route('/save/:sessionId(\d+)').post(function(req, res) {
    let session = new DMSession(req.body);
    session.save()
        .then(session => {
            res.status(200).json()
        });
});

// add session Router to the application
app.use('/checkEmail', checkRouter);
app.use('/session', sessionRouter);

// start server
app.listen(PORT, function() {
    console.log('Server is running on port ' + PORT.toString());
});
