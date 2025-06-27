const Match = require('../models/Match');
const Request = require('../models/Request');
const User = require('../models/User');

const createMatch = async (req, res) => {
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


const getAllMatches = async (req, res) => {
  try {
    const { location, date, surface } = req.query;
    const filters = {};
    if (location) filters.location = { $regex: new RegExp(location, 'i') };
    if (date) filters.date = date;
    if (surface) filters.surface = surface;

    const allMatches = await Match.find(filters)
      .populate('creator', 'username level location age gender email')
      .sort({ date: 1, time: 1 });

    const requests = await Request.find({ status: 'acceptată' });
    const excludedMatchIds = requests.map(r => r.match.toString());

    const filteredMatches = allMatches.filter(m => !excludedMatchIds.includes(m._id.toString()));

    res.status(200).json(filteredMatches);
  } catch (err) {
    console.error('Eroare la obținerea meciurilor:', err);
    res.status(500).json({ message: 'Eroare la obținerea meciurilor' });
  }
};


const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('creator', 'username email gender level location age');

    if (!match) {
      return res.status(404).json({ message: 'Meciul nu a fost găsit' });
    }

    res.status(200).json(match);
  } catch (error) {
    console.error('Eroare la obținerea meciului:', error);
    res.status(500).json({ message: 'Eroare la obținerea meciului' });
  }
};


const sendRequest = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const senderId = req.session.user.id;

    const existingRequest = await Request.findOne({ sender: senderId, match: matchId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Ai trimis deja o cerere pentru acest meci.' });
    }

    const request = new Request({ sender: senderId, match: matchId });
    await request.save();

    res.status(201).json({ message: 'Cerere trimisă cu succes!' });
  } catch (err) {
    console.error('Eroare la trimiterea cererii:', err);
    res.status(500).json({ message: 'Eroare la trimiterea cererii' });
  }
};


const getUserMatches = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const currentUser = await User.findById(userId).select('username email');
    if (!currentUser) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }

    
    const requests = await Request.find({ sender: userId, status: 'acceptată' }).populate({
      path: 'match',
      populate: { path: 'creator', select: 'username email' }
    });

    
    const createdMatches = await Match.find({ creator: userId }).populate('creator', 'username email');

    const accepted = [];
    const finalized = [];

    
    for (const req of requests) {
      if (!req.match || !req.match.creator) continue;
      const match = req.match;
      const creator = match.creator;

      const matchData = {
        ...match._doc,
        creator: creator,
        opponent: currentUser, 
        user: currentUser
      };

      if (match.isPlayed) {
        finalized.push(matchData);
      } else {
        accepted.push(matchData);
      }
    }

    
    for (const match of createdMatches) {
      const acceptedRequest = await Request.findOne({ match: match._id, status: 'acceptată' })
        .populate('sender', 'username email');
      if (!acceptedRequest) continue;

      const opponent = acceptedRequest.sender;

      const matchData = {
        ...match._doc,
        creator: match.creator,
        opponent,
        user: currentUser
      };

      if (match.isPlayed) {
        finalized.push(matchData);
      } else {
        accepted.push(matchData);
      }
    }

    res.status(200).json({ accepted, finalized, userId });
  } catch (err) {
    console.error('Eroare la getUserMatches:', err);
    res.status(500).json({ message: 'Eroare internă' });
  }
};




const finalizeMatch = async (req, res) => {
  try {
    const matchId = req.params.id;
    const userId = req.session.user.id;
    const { score, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Ratingul este obligatoriu și trebuie să fie între 1 și 5.' });
    }

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Meciul nu a fost găsit' });

    if (match.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Nu ai voie să finalizezi acest meci' });
    }

    match.isPlayed = true;
    match.score = score;
    match.ratingGiven = rating;
    await match.save();

    res.status(200).json({ message: 'Meci finalizat cu succes' });
  } catch (err) {
    console.error('Eroare la finalizarea meciului:', err);
    res.status(500).json({ message: 'Eroare la finalizarea meciului' });
  }
};


module.exports = {
  createMatch,
  getAllMatches,
  getMatchById,
  sendRequest,
  getUserMatches,
  finalizeMatch
};
