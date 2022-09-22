const router = require('express').Router();
const { User } = require('../models/user.model');
const { getUsers, addUser } = require('../models/user.model');

router.route('/').get((req, res) => {
  getUsers().then((users) => res.status(200).send(users));
});

router.route('/add').post((req, res) => {
  const { username } = req.body;

  const newUser = new User({ username });

  addUser(newUser)
    .then(() => res.json('User added!'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
