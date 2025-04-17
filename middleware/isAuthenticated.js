function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      next(); 
    } else {
      res.status(401).send('Acces interzis. Trebuie să fii autentificat.');
    }
  }
  
  module.exports = isAuthenticated;
  