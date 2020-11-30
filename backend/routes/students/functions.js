const ddb = require('../../private/dynamo_aws').ddb;
const s3 = require('../../private/s3_aws').s3;
const rekognition = require('../../private/rekognition_aws').rek;


let upload_s3_file = function (screenshot, name) {
    return new Promise((resolve, reject) => {
        var screenshotname = '';
        var screenshotbody = null;
        var uploadParams = null;

        if (screenshot != '') {
            screenshotname = `students/${name}.${screenshot.substring(screenshot.indexOf('/') + 1, screenshot.indexOf(';base64'))}`;
            screenshotbody = Buffer.from(screenshot.split(",")[1], 'base64');
            uploadParams = {
                Bucket: 'pro1-images-grupo12',
                Key: screenshotname,
                Body: screenshotbody,
                ACL: 'public-read'
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
            resolve({ Location: '', key: '' });
        }
    });
}

let create_dynamo = function (username, urlimage, keyimage) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: 'students',
            Item: {
                'identifier': { S: username },
                'urlimage': { S: urlimage },
                'keyimage': { S: keyimage }
            }
        };
        ddb.putItem(params, function (error, data) {
            if (error) {
                err = new Error(error);
                err.status = 404;
                reject(false);
            } else {
                resolve(true);
            }
        })
    })
}

let add_image_collection = function (id, key) {
    return new Promise((resolve, reject) => {
        if (key != '') {
            var params = {
                CollectionId: "students",
                DetectionAttributes: [
                ],
                ExternalImageId: id,
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

let search_dynamo = function (value) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'students',
            Key: {
                'identifier': { S: value }
            },
            ProjectionExpression: 'identifier'
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


exports.upload_s3_file = upload_s3_file;
exports.create_dynamo = create_dynamo;
exports.search_dynamo = search_dynamo;
exports.add_image_collection = add_image_collection;