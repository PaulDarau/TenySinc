const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const isAuthenticated = require('../middleware/isAuthenticated');


router.post('/create-match', isAuthenticated, matchController.createMatch);

router.get('/matches', isAuthenticated, matchController.getAllMatches);

router.get('/match/:id', isAuthenticated, matchController.getMatchById);

router.post('/match/:matchId/request', isAuthenticated, matchController.sendRequest);

router.get('/my-matches', isAuthenticated, matchController.getUserMatches);

router.patch('/finalize-match/:id', isAuthenticated, matchController.finalizeMatch);

module.exports = router;
