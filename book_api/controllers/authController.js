const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');



exports.signup = (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    userModel.createUser(username, hashedPassword, (err) => {
      if (err) return res.status(500).json({ error: 'User creation failed' });
      res.status(201).json({ message: 'User created' });
    });
  });
};



exports.login = (req, res) => {
  const { username, password } = req.body;
  userModel.findUserByUsername(username, (err, user) => {
    if (!user) return res.status(404).json({ error: 'User not found' });
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ error: 'Invalid password' });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ token });
    });
  });
};
