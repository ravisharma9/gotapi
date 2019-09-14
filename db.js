const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://gotuser:Zxlu1dATktqxDawa@raviorg-efrb9.mongodb.net/got?retryWrites=true&w=majority";
const dbName = "got"

module.exports = {
    insertCollection: insertCollection,
    findInCollection: findInCollection,
    distinctInCollection: distinctInCollection
}

function insertCollection(model) {
    return new Promise(async (resolve, reject) => {
        try {
            if (model && model.data && model.collection) {
                MongoClient.connect(url, function (err, db) {
                    if (err) {
                        return reject({ status: "failure", msg: err })
                    };
                    db.db(dbName).collection(model.collection).insertMany(model.data, function (err, res) {
                        if (err) {
                            return reject({ status: "failure", msg: err })
                        }
                        console.log("no. of documents inserted: " + res.insertedCount);
                        db.close();
                        return resolve({ status: "success", msg: "insert successfull" })
                    });
                });
            } else {
                return reject({ status: "failure", msg: "insert failed, missing data or collection name" })
            }
        }
        catch (e) {
            console.log(e)
            return reject({ status: "failure", msg: "something went wrong in db operation" })
        }

    })
}

function findInCollection(model) {
    return new Promise(async (resolve, reject) => {
        try {
            if (model && model.data && model.collection) {
                MongoClient.connect(url, function (err, db) {
                    if (err) {
                        return reject({ status: "failure", msg: err })
                    }
                    db.db(dbName).collection(model.collection).find(model.data).toArray(function (err, result) {
                        if (err) {
                            return reject({ status: "failure", msg: err })
                        }
                        // console.log(result);
                        db.close();
                        return resolve({ status: "success", msg: "find successfull", data: result })
                    });
                });
            } else {
                return reject({ status: "failure", msg: "find failed, missing data or collection name" })
            }
        }
        catch (e) {
            console.log(e)
            return reject({ status: "failure", msg: "something went wrong in db operation" })
        }

    })
}

function distinctInCollection(model) {
    return new Promise(async (resolve, reject) => {
        try {
            if (model && model.key && model.collection && model.query) {
                MongoClient.connect(url, function (err, db) {
                    if (err) {
                        return reject({ status: "failure", msg: err })
                    }
                    db.db(dbName).collection(model.collection).distinct(model.key, model.query,
                        (function (err, result) {
                            if (err) {
                                return reject({ status: "failure", msg: err })
                            }
                            if (result) {
                                // console.log(result);
                                return resolve({ status: "success", msg: "find successfull", data: result })
                            }
                        })
                    );
                });
            } else {
                return reject({ status: "failure", msg: "missing key or collection name or query" })
            }
        }
        catch (e) {
            console.log(e)
            return reject({ status: "failure", msg: "something went wrong in db operation" })
        }
    })
}