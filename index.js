
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const isAuthenticated = require('./middleware/isAuthenticated');
const path = require('path');
const requestRoutes = require('./routes/requestRoutes');



const app = express();
app.use(express.static('public'));




app.use(session({
  secret: 'tenisync_secret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));



mongoose.connect( 'mongodb+srv://pauldarau2:Adrian2002@cluster0.odn8gc5.mongodb.net/tennisapp?retryWrites=true&w=majority&appName=Cluster0'  , {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectat la MongoDB!'))
.catch(err => console.error('Eroare la conectare MongoDB:', err));


app.use(express.json());
app.use(express.static('views'));
app.use('/api', authRoutes);
app.use('/api', matchRoutes);
app.use('/api', requestRoutes);




app.get('/', (req, res) => {
  res.send('Salut din TeniSync 🎾!');
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/match-details', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'match-details.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
