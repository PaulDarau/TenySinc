
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const isAuthenticated = require('../middleware/isAuthenticated');
const Request = require('../models/Request'); 



router.post('/send-request', isAuthenticated, requestController.sendRequest);


router.get('/sent-requests', isAuthenticated, requestController.getSentRequests);


router.get('/received-requests', isAuthenticated, requestController.getReceivedRequests);


router.patch('/update-request/:id', isAuthenticated, requestController.updateRequestStatus);


router.delete('/cancel-request/:id', isAuthenticated, async (req, res) => {
  try {
    const requestId = req.params.id;
    const deleted = await Request.findOneAndDelete({
      _id: requestId,
      sender: req.session.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Cererea nu a fost găsită' });
    }

    res.status(200).json({ message: 'Cererea a fost anulată' });
  } catch (err) {
    console.error('Eroare la anularea cererii:', err);
    res.status(500).json({ message: 'Eroare internă la anulare' });
  }
});

module.exports = router;