const User = require('../models/User');
const bcrypt = require('bcrypt');


exports.registerUser = async (req, res) => {
  try {
    const { email, username, password, level, gender, location, age } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilizatorul sau emailul există deja' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      level,
      gender,
      location,
      age
    });

    await newUser.save();
    res.status(201).json({ message: 'Înregistrare reușită!' });

  } catch (error) {
    console.error('Eroare detaliată la înregistrare:', error);
    res.status(500).json({ message: 'Eroare la înregistrare', error });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    });

    if (!user) return res.status(400).json({ message: 'Utilizator inexistent' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Parolă incorectă' });

    req.session.user = {
      id: user._id
    };

    res.status(200).json({ message: 'Autentificare reușită!' });

  } catch (error) {
    console.error('Eroare detaliată la autentificare:', error);
    res.status(500).json({ message: 'Eroare la autentificare', error });
  }
};


exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Eroare la logout' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout realizat cu succes' });
  });
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
    }
    res.json(user);
  } catch (error) {
    console.error('Eroare la obținerea profilului:', error);
    res.status(500).json({ message: 'Eroare la obținerea profilului' });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { location, age, level } = req.body;

    await User.findByIdAndUpdate(userId, { location, age, level });

    res.status(200).json({ message: 'Profil actualizat cu succes!' });
  } catch (error) {
    console.error('Eroare la actualizarea profilului:', error);
    res.status(500).json({ message: 'Eroare la actualizare' });
  }
};
