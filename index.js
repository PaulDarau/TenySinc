require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const isAuthenticated = require('./middleware/isAuthenticated');

const app = express();


app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: 'tenisync_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


mongoose.connect('mongodb+srv://pauldarau2:Adrian2002@cluster0.odn8gc5.mongodb.net/tennisapp?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectat la MongoDB!'))
.catch(err => console.error('Eroare la conectare MongoDB:', err));


app.use('/api', authRoutes);
app.use('/api', matchRoutes);
app.use('/api', requestRoutes);
app.use('/api', userRoutes); 


app.use(express.static('views'));

app.get('/', (req, res) => {
  res.send('Salut din TeniSync 🎾!');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});


app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/match-details', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'match-details.html'));
});

app.get('/my-matches', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'my-matches.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serverul rulează pe toate interfețele la portul ${PORT}`);
});

