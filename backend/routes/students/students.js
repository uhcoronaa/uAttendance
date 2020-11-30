var express = require('express');
var router = express.Router();
var functions = require('./functions');

/* GET users listing. */
router.get('/', function (req, res, next) {
  const ddb = require('../../private/dynamo_aws').ddb;
  var params = {
    TableName: "students"
  };
  ddb.scan(params, function (err, data) {
    if (err || data.Items == undefined) {
      res.status(404).send({err})
    } else {
      res.status(200).send(data.Items)
    }
  });
});

router.post('/insert', async (req, res, next) => {
  var { id, photoBase64 } = req.body;
  try {
    var existe = await functions.search_dynamo(id);
    if (existe == false) {
      var dataimage = await functions.upload_s3_file(photoBase64, id);
      await functions.add_image_collection(id, dataimage.key);
      var rescreateuser = await functions.create_dynamo(id, dataimage.Location, dataimage.key);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: "Se creo el Estudiante", student: rescreateuser });
    }
    else if (existe == true) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ message: 'El estudiante ya existe' });
    }
  }
  catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
