var express = require('express');
var router = express.Router();
var register_functions = require('./register_functions');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var screenshot = req.body.screenshot;
  try {
    var existe = await register_functions.search_dynamo_user(username);
    if (existe == false) {
      var passencriptada = await register_functions.crypt_password(password);
      var dataimage = await register_functions.upload_s3_file(screenshot, username);
      await register_functions.add_image_collection(username, dataimage.key);
      var rescreateuser = await register_functions.create_dynamo_user(username, passencriptada, dataimage.Location, dataimage.key);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(rescreateuser);
    }
    else if (existe == true) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ res: 'El usuario ya existe' });
    }
  }
  catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
