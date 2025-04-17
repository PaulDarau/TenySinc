const Request = require('../models/Request');
const Match = require('../models/Match');

// ✅ Trimitere cerere
exports.sendRequest = async (req, res) => {
  try {
    const { matchId } = req.body;
    const senderId = req.session.user.id;

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Meciul nu a fost găsit' });
    }

    if (match.creator.toString() === senderId) {
      return res.status(400).json({ message: 'Nu poți trimite cerere la propriul tău meci' });
    }

    const existing = await Request.findOne({ match: matchId, sender: senderId });
    if (existing) {
      return res.status(400).json({ message: 'Ai trimis deja o cerere pentru acest meci' });
    }

    const newRequest = new Request({
      match: matchId,
      sender: senderId
    });

    await newRequest.save();
    res.status(201).json({ message: 'Cerere trimisă cu succes!' });
  } catch (err) {
    console.error('Eroare la trimiterea cererii:', err);
    res.status(500).json({ message: 'Eroare la trimiterea cererii' });
  }
};

// ✅ Afișează cererile trimise
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ sender: req.session.user.id })
      .populate('match')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Eroare la obținerea cererilor trimise:', err);
    res.status(500).json({ message: 'Eroare la obținerea cererilor trimise' });
  }
};

// ✅ Afișează cererile primite
exports.getReceivedRequests = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const userMatches = await Match.find({ creator: userId }).select('_id');
    const matchIds = userMatches.map(m => m._id);

    const requests = await Request.find({ match: { $in: matchIds } })
      .populate('sender', 'username email level age location gender')
      .populate('match', 'location date time surface')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error('Eroare la cererile primite:', err);
    res.status(500).json({ message: 'Eroare la obținerea cererilor primite' });
  }
};

// ✅ Actualizare status cerere (acceptată / respinsă)
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const userId = req.session.user.id;

    if (!['acceptată', 'respinsă'].includes(status)) {
      return res.status(400).json({ message: 'Status invalid' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Cererea nu a fost găsită' });
    }

    const match = await Match.findById(request.match);
    if (!match || match.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Nu ai permisiunea să modifici această cerere' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: `Cererea a fost ${status}` });
  } catch (err) {
    console.error('Eroare la actualizarea cererii:', err);
    res.status(500).json({ message: 'Eroare la actualizarea cererii' });
  }
};
