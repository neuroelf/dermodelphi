// server port
const PORT = 4000;

// import mongo, express, and other requirements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dm_log = require('./dm_log');
const dm_users = require('./dm_users');
const md5 = require('md5');
const md5salt = require('./md5salt');

// create express router for sessions
const adminRouter = express.Router();
const checkRouter = express.Router();
const sessionRouter = express.Router();

// add middle-wares to express app
app.use(cors());
app.use(bodyParser.json());

// connect to database
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://127.0.0.1:27017/diagnosis_mapper', { useNewUrlParser: true });
const DMDBConnection = mongoose.connection;
DMDBConnection.once('open', function() {
    dm_log.dm_log('mongodb connection to diagnosis_mapper DB successful.');
});

// import model from separate script file
let DMSession = require('./dmSession.model');
let DMSessionBlock = require('./dmSessionBlock.model');
let DMSessionId = require('./dmSessionId.model');

// make sure all users are in the database
dm_users.setupUsers(DMSessionId, DMSession);

// create endpoint for confirming user to email
checkRouter.route('/:userEmail/:sessionId').get(function (req, res) {
    let userEmail = req.params.userEmail.toLowerCase();
    let sessionId = req.params.sessionId;
    dm_log.dm_log('Checking email ' + userEmail + ' against session ID ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    DMSessionId.findOne({ userEmail: userEmail, sessionId: sessionId }, function(err, session) {
        if (err) {
            dm_log.dm_log(' - error(checkEmail): ' + JSON.stringify(err));
            res.json({ error: err });
            return;
        }
        if (session === null) {
            dm_log.dm_log(' - error(checkEmail): session not found.');
            res.json({ error: 'SESSION_NOT_FOUND' });
            return;
        }
        dm_log.dm_log(' - success(checkEmail)');
        res.json(session);
    });
});

// create endpoints for getting session and block information
sessionRouter.route('/:sessionId').get(function (req, res) {
    let sessionId = req.params.sessionId;
    dm_log.dm_log('Loading session ID ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    DMSession.findOne({ sessionId: sessionId }, function(err, session) {
        if (err) {
            dm_log.dm_log(' - error(loadSession): ' + JSON.stringify(err));
            res.end(JSON.stringify({ error: err }));
            return;
        }
        dm_log.dm_log(' - success(loadSession)');
        res.json(session);
    });
});
sessionRouter.route('/:sessionId/blocks').get(function (req, res) {
    let sessionId = req.params.sessionId;
    dm_log.dm_log('Loading all blocks for session ID ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    DMSessionBlock.find({ sessionId: sessionId }, function (err, blocks) {
        if (err) {
            dm_log.dm_log(' - error(loadSessionBlocks): ' + JSON.stringify(err));
            res.end(JSON.stringify({ error: err }));
            return;
        }
        dm_log.dm_log(' - success(loadSessionBlocks)');
        res.json(blocks);
    });
});
sessionRouter.route('/:sessionId/block/:blockId').get(function (req, res) {
    let sessionId = req.params.sessionId;
    let blockId = parseInt(req.params.blockId);
    dm_log.dm_log('Loading block ' + blockId.toString() + ' for session ID ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    DMSessionBlock.findOne({ sessionId: sessionId, blockId: blockId }, function (err, block) {
        if (err) {
            dm_log.dm_log(' - error(loadSessionBlock): ' + JSON.stringify(err));
            res.end(JSON.stringify({ error: err }));
            return;
        }
        dm_log.dm_log(' - success(loadSessionBlock)');
        res.json(block);
    });
});

// endpoints for saving session information
sessionRouter.route('/:sessionId/save').post(function(req, res) {
    let sessionId = req.params.sessionId;
    dm_log.dm_log('Updating session ID ' + sessionId);
    dm_log.dm_log(' - content: ' + JSON.stringify(req.body));
    res.setHeader('Content-Type', 'application/json');
    DMSession.updateOne({ sessionId: sessionId }, { $set: req.body})
    .then(dbres => {
        if ((dbres.n === 1) && (dbres.nModified === 1)) {
            dm_log.dm_log(' - success(saveSession)');
            res.status(200).json(dbres);
        } else {
            dm_log.dm_log(' - error(saveSession): ' + JSON.stringify(dbres));
            res.status(500).json(dbres);
        }
    }).catch(function (err) {
        dm_log.dm_log(' - error(saveSession): ' + JSON.stringify(err));
        res.status(500).json({error: err});
    });
    return;
});
sessionRouter.route('/:sessionId/block/:blockId/save').post(function(req, res) {
    let sessionId = req.params.sessionId;
    let blockId = parseInt(req.params.blockId);
    let block = req.body.block;
    dm_log.dm_log('Trying to update block ' + blockId.toString() + ' for session ID ' + sessionId);
    dm_log.dm_log(' - content: ' + JSON.stringify(req.body));
    res.setHeader('Content-Type', 'application/json');
    DMSessionBlock.updateOne({ sessionId: sessionId, blockId: blockId }, { $set: req.body})
    .then(dbres => {
        if ((dbres.n === 0) && (dbres.nModified === 0)) {
            dm_log.dm_log(' - status(saveSessionBlock): didn\'t exist, saving instead');
            block = new DMSessionBlock({
                sessionId: sessionId,
                blockId: blockId,
                block: block
            }).save().then(function (dbres) {
                if ((dbres.sessionId === sessionId) && (dbres.blockId === blockId)) {
                    dm_log.dm_log(' - success(saveSessionBlock)');
                    res.status(200).json({n: 1, nModified: 1, ok: 1});
                } else {
                    dm_log.dm_log(' - error(saveSessionBlock): ' + JSON.stringify(dbres));
                    res.status(500).json({ error: 'Internal error!'});
                }
            }).catch(function (err) {
                dm_log.dm_log(' - error(saveSessionBlock): ' + JSON.stringify(err));
                res.status(500).json({ error: err});
            });
        } else {
            dm_log.dm_log(' - status(saveSessionBlock): ' + JSON.stringify(dbres));
            res.status(200).json(dbres);
        }
    });
});

// endpoints for admin tasks
adminRouter.route('/:sessionId/token/:tokenId/blocks/:blockId').get(function (req, res) {
    let sessionId = req.params.sessionId;
    let tokenId = req.params.tokenId;
    let blockId = parseInt(req.params.blockId);
    let tokenTest = md5(sessionId + md5salt.md5salt);
    dm_log.dm_log('Accessing admin/blocks ' + blockId.toString() + ' with sessionId ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    if (tokenTest.substr(4, 8).toLowerCase() !== tokenId.toLowerCase()) {
        dm_log.dm_log(' - status(adminGetBlocks')
        res.status(500).json({ error: 'Invalid sessionId/tokenId combination'});
        return;
    }
    DMSessionId.findOne({ sessionId: sessionId }, function(err, session) {
        if (err) {
            dm_log.dm_log(' - error(adminGetBlocks): ' + JSON.stringify(err));
            res.json({ error: err });
            return;
        }
        if (session === null) {
            dm_log.dm_log(' - error(adminGetBlocks): session not found.');
            res.json({ error: 'SESSION_NOT_FOUND' });
            return;
        }
        DMSessionBlock.find({ blockId: blockId }, function (err, blocks) {
            if (err) {
                dm_log.dm_log(' - error(adminGetBlocks): ' + JSON.stringify(err));
                res.json({ error: err });
                return;
            }
            if (blocks === null) {
                dm_log.dm_log(' - status(adminGetBlocks): no blocks with ID ' + blockId.toString());
                res.status(200).json([]);
                return;
            }
            var bc, filteredBlocks = [];
            for (bc = 0; bc < blocks.length; bc++) {
                var addBlock;
                var oldBlock = blocks[bc];
                if ('_doc' in oldBlock) {
                    addBlock = oldBlock['_doc'];
                } else {
                    addBlock = oldBlock;
                }
                filteredBlocks.push(addBlock);
            }
            dm_log.dm_log(' - status(adminGetBlocks): filtered ' + bc.toString() + ' blocks.');
            res.json(filteredBlocks);
        });
    });
});
adminRouter.route('/:sessionId/token/:tokenId/nodes/:nodeId').get(function (req, res) {
    let sessionId = req.params.sessionId;
    let tokenId = req.params.tokenId;
    let nodeId = parseInt(req.params.nodeId);
    let blockId = Math.floor(nodeId / 100);
    let tokenTest = md5(sessionId + md5salt.md5salt);
    dm_log.dm_log('Accessing admin/nodes ' + nodeId.toString() + ' with sessionId ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    if (tokenTest.substr(4, 8).toLowerCase() !== tokenId.toLowerCase()) {
        dm_log.dm_log(' - status(adminGetNodes')
        res.status(500).json({ error: 'Invalid sessionId/tokenId combination'});
        return;
    }
    DMSessionId.findOne({ sessionId: sessionId }, function(err, session) {
        if (err) {
            dm_log.dm_log(' - error(adminGetNodes): ' + JSON.stringify(err));
            res.json({ error: err });
            return;
        }
        if (session === null) {
            dm_log.dm_log(' - error(adminGetNodes): session not found.');
            res.json({ error: 'SESSION_NOT_FOUND' });
            return;
        }
        DMSessionBlock.find({ blockId: blockId }, function (err, blocks) {
            if (err) {
                dm_log.dm_log(' - error(adminGetNodes): ' + JSON.stringify(err));
                res.json({ error: err });
                return;
            }
            if (blocks === null) {
                dm_log.dm_log(' - status(adminGetNodes): no blocks with ID ' + blockId.toString());
                res.status(200).json([]);
                return;
            }
            var bc, filteredBlocks = [];
            for (bc = 0; bc < blocks.length; bc++) {
                var addBlock = {};
                var oldBlock = blocks[bc];
                if ('_doc' in oldBlock) {
                    oldBlock = oldBlock['_doc'];
                }
                addBlock['sessionId'] = oldBlock.sessionId;
                addBlock['blockId'] = oldBlock.blockId;
                addBlock['block'] = {};
                if (nodeId in oldBlock.block) {
                    addBlock.block[nodeId] = oldBlock.block[nodeId];
                }
                filteredBlocks.push(addBlock);
            }
            dm_log.dm_log(' - status(adminGetBlocks): filtered ' + bc.toString() + ' blocks.');
            res.json(filteredBlocks);
        });
    });
});
adminRouter.route('/:sessionId/token/:tokenId/sessions').get(function (req, res) {
    let sessionId = req.params.sessionId;
    let tokenId = req.params.tokenId;
    let tokenTest = md5(sessionId + md5salt.md5salt);
    dm_log.dm_log('Accessing admin/sessions with sessionId ' + sessionId);
    res.setHeader('Content-Type', 'application/json');
    if (tokenTest.substr(4, 8).toLowerCase() !== tokenId.toLowerCase()) {
        dm_log.dm_log(' - status(adminGetSessions')
        res.status(200).json({ error: 'Invalid sessionId/tokenId combination'});
        return;
    }
    DMSessionId.findOne({ sessionId: sessionId }, function(err, session) {
        if (err) {
            dm_log.dm_log(' - error(adminGetSessions): ' + JSON.stringify(err));
            res.json({ error: err });
            return;
        }
        if (session === null) {
            dm_log.dm_log(' - error(adminGetSessions): session not found.');
            res.json({ error: 'SESSION_NOT_FOUND' });
            return;
        }
        DMSession.find({}, function (err, sessions) {
            if (err) {
                dm_log.dm_log(' - error(adminGetSessions): ' + JSON.stringify(err));
                res.json({ error: err });
                return;
            }
            if (sessions === null) {
                dm_log.dm_log(' - status(adminGetSessions): no sessions found.');
                res.status(500).json([]);
                return;
            }
            var sc, fc, filteredSessions = [];
            const copyFields = ['newAs', 'newBs', 'newCs', 'sessionDate', 'sessionId'];
            for (sc = 0; sc < sessions.length; sc++) {
                var addSession = {};
                var oldSession = sessions[sc];
                if ('_doc' in oldSession) {
                    oldSession = oldSession['_doc'];
                }
                for (fc = 0; fc < copyFields.length; fc++) {
                    addSession[copyFields[fc]] = oldSession[copyFields[fc]];
                }
                filteredSessions.push(addSession);
            }
            dm_log.dm_log(' - status(adminGetSessions): filtered ' + sc.toString() + ' sessions.');
            res.json(filteredSessions);
        });
    });
});

// add session Router to the application
app.use('/checkEmail', checkRouter);
app.use('/session', sessionRouter);
app.use('/admin', adminRouter);

// start server
app.listen(PORT, '127.0.0.1', function() {
    dm_log.dm_log('Server is running on port ' + PORT.toString());
});
