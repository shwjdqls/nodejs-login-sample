var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.logined) {
    res.redirect('users');
  } else {
    res.render('index', {
      title: 'Express',
      alert: null,
    });
  }
});

module.exports = router;
