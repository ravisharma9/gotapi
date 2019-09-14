var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://gotuser:Zxlu1dATktqxDawa@raviorg-efrb9.mongodb.net/got?retryWrites=true&w=majority";
var dbName = "got"

module.exports = {
    insertCollection: insertCollection
}

function insertCollection(model) {
    return new Promise(async (resolve, reject) => {
        try {
            if (model && model.data && model.collection) {
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    db.db(dbName).collection(model.collection).insertMany(model.data, function (err, res) {
                        if (err) throw err;
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