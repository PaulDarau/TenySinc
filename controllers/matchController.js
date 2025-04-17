const Match = require('../models/Match');
const Request = require('../models/Request');

console.log('DEBUG Match:', Match);

// Creare meci
exports.createMatch = async (req, res) => {
  try {
    const { location, date, time, surface } = req.body;
    const userId = req.session.user.id;

    const newMatch = new Match({
      creator: userId,
      location,
      date,
      time,
      surface
    });

    await newMatch.save();
    res.status(201).json({ message: 'Meci creat cu succes!' });
  } catch (err) {
    console.error('Eroare la crearea meciului:', err);
    res.status(500).json({ message: 'Eroare la crearea meciului' });
  }
};

// Obține toate meciurile cu opțiune de filtrare
exports.getAllMatches = async (req, res) => {
  try {
    const { location, date, surface } = req.query;

    const filters = {};

    if (location) {
      filters.location = { $regex: new RegExp(location, 'i') };
    }

    if (date) {
      filters.date = date;
    }

    if (surface) {
      filters.surface = surface;
    }

    const matches = await Match.find(filters)
      .populate('creator', 'username level location age gender email')
      .sort({ date: 1, time: 1 });

    res.status(200).json(matches);
  } catch (err) {
    console.error('Eroare la obținerea meciurilor:', err);
    res.status(500).json({ message: 'Eroare la obținerea meciurilor' });
  }
};

// Obține detalii pentru un meci specific
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('creator', 'username email gender level location age');

    if (!match) {
      return res.status(404).json({ message: 'Meciul nu a fost găsit' });
    }

    res.status(200).json(match);
  } catch (error) {
    console.error('Eroare la obținerea meciului:', error);
    res.status(500).json({ message: 'Eroare la obținerea meciului' });
  }
};

// ✅ Trimite cerere de participare la un meci
exports.sendRequest = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const senderId = req.session.user.id;

    const existingRequest = await Request.findOne({ sender: senderId, match: matchId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Ai trimis deja o cerere pentru acest meci.' });
    }

    const request = new Request({
      sender: senderId,
      match: matchId
    });

    await request.save();
    res.status(201).json({ message: 'Cerere trimisă cu succes!' });
  } catch (err) {
    console.error('Eroare la trimiterea cererii:', err);
    res.status(500).json({ message: 'Eroare la trimiterea cererii' });
  }
};
