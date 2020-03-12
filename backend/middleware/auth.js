const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
     const token  = req.header('authorization').replace('Bearer ', '')
     const decode = jwt.verify(token, "himanshurahi")
     req.userData = {id : decode.id, username : decode.username, email : decode.email}
     next()

  } catch (error) {
    res.status(401).send('Please Auth')
  }
};

module.exports = auth;
