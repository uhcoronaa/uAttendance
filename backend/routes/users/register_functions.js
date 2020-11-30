const ddb = require('../../private/dynamo_aws').ddb;
const s3 = require('../../private/s3_aws').s3;
var bcrypt = require('bcrypt');
const rekognition = require('../../private/rekognition_aws').rek;

let crypt_password = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (error, hash) => {
            if (error) {
                err = new Error(error);
                err.status = 404;
                reject(err);
            }
            resolve(hash);
        });
    });
}

let upload_s3_file = function (screenshot, name) {
    return new Promise((resolve, reject) => {
        var screenshotname = '';
        var screenshotbody = null;
        var uploadParams = null;

        if (screenshot != '') {
            screenshotname = `users/${name}.${screenshot.substring(screenshot.indexOf('/') + 1, screenshot.indexOf(';base64'))}`;
            screenshotbody = Buffer.from(screenshot.split(",")[1], 'base64');
            uploadParams = {
                Bucket: 'pro1-images-grupo12',
                Key: screenshotname,
                Body: screenshotbody
            };
            s3.upload(uploadParams, (error, data) => {
                if (error) {
                    err = new Error(error);
                    err.status = 404;
                    reject(err);
                } if (data) {
                    resolve(data);
                }
            });
        }
        else {
            resolve({Location:'', key:''});
        }
    });
}

let create_dynamo_user = function (username, password, urlimage, keyimage) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: 'users',
            Item: {
                'username': { S: username },
                'password': { S: password },
                'urlimage': { S: urlimage },
                'keyimage': { S: keyimage }
            }
        };
        ddb.putItem(params, function (error, data) {
            if (error) {
                err = new Error(error);
                err.status = 404;
                reject(err);
            } else {
                resolve({ res: 'Se registro correctamente' });
            }
        })
    })
}

let add_image_collection = function (username, key) {
    return new Promise((resolve, reject) => {
        if (key != '') {
            var params = {
                CollectionId: "users",
                DetectionAttributes: [
                ],
                ExternalImageId: username,
                Image: {
                    S3Object: {
                        Bucket: "pro1-images-grupo12",
                        Name: key
                    }
                }
            };
            rekognition.indexFaces(params, function (err, data) {
                if (err) {
                    error = new Error(err);
                    error.statusCode = 404;
                    reject(error);
                }
                resolve(data);
            });
        }
        else {
            resolve('');
        }
    });
}

let search_dynamo_user = function (username) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'users',
            Key: {
                'username': { S: username }
            },
            ProjectionExpression: 'username'
        };
        ddb.getItem(params, (error, data) => {
            if (error) {
                err = new Error(error);
                err.status = 404;
                reject(err);
            } else {
                if (data.Item != undefined) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
        });
    });
}

exports.crypt_password = crypt_password;
exports.upload_s3_file = upload_s3_file;
exports.create_dynamo_user = create_dynamo_user;
exports.search_dynamo_user = search_dynamo_user;
exports.add_image_collection = add_image_collection;