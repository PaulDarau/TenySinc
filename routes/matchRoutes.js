const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const isAuthenticated = require('../middleware/isAuthenticated');

// ✅ Creare meci
router.post('/create-match', isAuthenticated, matchController.createMatch);

// ✅ Obține toate meciurile (cu filtrare)
router.get('/matches', isAuthenticated, matchController.getAllMatches);

// ✅ Obține detalii pentru un meci specific
router.get('/match/:id', isAuthenticated, matchController.getMatchById);

// ✅ Trimite cerere de participare la un meci
router.post('/match/:matchId/request', isAuthenticated, matchController.sendRequest);

// ✅ Obține meciurile utilizatorului (acceptate + finalizate)
router.get('/my-matches', isAuthenticated, matchController.getUserMatches);

// ✅ Finalizează un meci (scor + rating)
router.patch('/finalize-match/:id', isAuthenticated, matchController.finalizeMatch);

module.exports = router;
