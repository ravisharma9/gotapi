const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://gotuser:Zxlu1dATktqxDawa@raviorg-efrb9.mongodb.net/got?retryWrites=true&w=majority";
const dbName = "got"

module.exports = {
    insertCollection: insertCollection,
    findInCollection: findInCollection,
    distinctInCollection: distinctInCollection,
    getStats: getStats
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

function getStats() {
    return new Promise(async function (resolve, reject) {
        try {
            let stats = {
                'most_active': {
                    'attacker_king': "",
                    'defender_king': "",
                    'region': "",
                    'name': "",
                },
                'attacker_outcome': {
                    'win': 0,
                    'loss': 0,
                },
                'battle_type': [],
                'defender_size': {
                    'average': 0,
                    'min': 0,
                    'max': 0,
                }
            }
            Array.prototype.max = function () {
                return Math.max.apply(null, this);
            };

            Array.prototype.min = function () {
                return Math.min.apply(null, this);
            };
            MongoClient.connect(url, async function (err, db) {
                if (err) return reject(err);

                let attacker_king = await db.db(dbName).collection("battles").aggregate({ "$group": { _id: "$attacker_king", count: { "$sum": 1 } } }, { "$sort": { count: -1 } }, { "$limit": 1 }, { "$max": "$count" }).toArray()
                stats.most_active.attacker_king = attacker_king[0]._id

                let defender_king = await db.db(dbName).collection("battles").aggregate({ "$group": { _id: "$defender_king", count: { "$sum": 1 } } }, { "$sort": { count: -1 } }, { "$limit": 1 }, { "$max": "$count" }).toArray()
                stats.most_active.defender_king = defender_king[0]._id

                let name = await db.db(dbName).collection("battles").aggregate({ "$group": { _id: "$name", count: { "$sum": 1 } } }, { "$sort": { count: -1 } }, { "$limit": 1 }, { "$max": "$count" }).toArray()
                stats.most_active.name = name[0]._id

                let region = await db.db(dbName).collection("battles").aggregate({ "$group": { _id: "$region", count: { "$sum": 1 } } }, { "$sort": { count: -1 } }, { "$limit": 1 }, { "$max": "$count" }).toArray()
                stats.most_active.region = region[0]._id

                let attacker_outcome = await db.db(dbName).collection('battles').find({}).project({ attacker_outcome: 1 }).toArray()
                stats.attacker_outcome.win = attacker_outcome.filter(val => val.attacker_outcome == "win").length
                stats.attacker_outcome.loss = attacker_outcome.filter(val => val.attacker_outcome == "loss").length

                let battle_type = await distinctInCollection({ collection: "battles", key: "battle_type", query: { "battle_type": { $nin: ["", null] } } })
                stats.battle_type = battle_type.data

                let defender_size = await db.db(dbName).collection('battles').find({}).project({ defender_size: 1 }).toArray()
                stats.defender_size.max = defender_size.filter(val => val.defender_size != null).map(val => val.defender_size).max()
                stats.defender_size.min = defender_size.filter(val => val.defender_size != null).map(val => val.defender_size).min()
                stats.defender_size.average = (defender_size.filter(val => val.defender_size != null).reduce((accumulator, data) => accumulator + data.defender_size, 0)) / (defender_size.filter(val => val.defender_size != null).map(val => val.defender_size).length)

                db.close()
                return resolve({ status: "success", msg: "find successfull", data: stats })
            })
        } catch (e) {
            return reject({ status: "failure", msg: "something went wrong in db operation" })
        }
    })
}