var express = require('express');
var router = express.Router();

var ddb = require('../../private/dynamo_aws').ddb;
var rek = require('../../private/rekognition_aws').rek
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/user', (req, res, next) => {
    const { username, password } = req.body

    var params = {
        TableName: 'users',
        Key: {
            'username': { S: username },
        }
    };
    ddb.getItem(params, (error, data) => {
        if (error || data.Item == undefined) {
            res.status(404).send({ message: "Usuario Invalido" })
        } else {
            bcrypt.compare(password, data.Item.password.S, function (err, result) {
                if (result == true) {
                    res.status(200).send({ message: "Bienvenido!", token: username })
                } else {
                    res.status(500).send({ message: "Contraseña no valida" })
                }
            });
        }
    })

});

router.post('/photo', (req, res, next) => {
    var params = {
        CollectionId: "users",
        FaceMatchThreshold: 95,
        Image: {
            "Bytes": Buffer.from(req.body.photoBase64.split(',')[1], 'base64')
        },
        MaxFaces: 1
    }
    rek.searchFacesByImage(params, function (err, data) {
        if (err || data.FaceMatches.length == 0){
            res.status(404).send({ message: "No se encontraron coincidencias" })
        }
        else {
            res.status(200).send({ message: "Bienvenido!", token: data.FaceMatches[0].Face.ExternalImageId })
        }
        
    });
});
module.exports = router;