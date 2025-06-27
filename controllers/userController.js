
const Match = require('../models/Match');
const User = require('../models/User');


const getAverageRating = async (req, res) => {
  try {
    const userId = req.params.id;

    const matches = await Match.find({
      players: userId,
      isPlayed: true,
      ratingGiven: { $exists: true }
    });

    const relevantRatings = matches.filter(match => match.creator.toString() !== userId);

    const ratings = relevantRatings.map(match => match.ratingGiven);
    const total = ratings.reduce((sum, r) => sum + r, 0);
    const avg = ratings.length > 0 ? total / ratings.length : 0;

    res.status(200).json({ avgRating: avg });
  } catch (err) {
    console.error('Eroare la calculul ratingului:', err);
    res.status(500).json({ message: 'Eroare la obținerea ratingului' });
  }
};

module.exports = { getAverageRating };
