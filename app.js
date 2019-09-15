module.exports = {
    list: list,
    count: count,
    search: search,
    stats: stats
}
var dbApp = require('./db.js')
var stringSimilarity = require('string-similarity');
var keyData = require(__dirname + '/document/battlesKey.json')

function list() {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await dbApp.distinctInCollection({ collection: "battles", key: "location", query: { "location": { $nin: ["", null] } } }))
        } catch (e) {
            return reject()
        }
    })
}

function count() {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await dbApp.distinctInCollection({ collection: "battles", key: "battle_number", query: { "battle_number": { $nin: ["", null] } } }))
        } catch (e) {
            return reject()
        }
    })
};


function search(requestData) {
    return new Promise(async (resolve, reject) => {
        try {
            let obj = { "$or": [] }
            for (let key in requestData) {
                let result = stringSimilarity.findBestMatch(key, keyData).ratings.filter(val => {
                    return val.rating >= 0.4
                });
                result.forEach(e => {
                    let searchObj = {}
                    searchObj[e.target] = requestData[key]
                    obj["$or"].push(searchObj)
                })
            }
            delete searchObj
            return resolve(await dbApp.findInCollection({ collection: "battles", data: obj }))
        } catch (e) {
            return reject()
        }
    })
}


function stats() {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await dbApp.getStats())
        } catch (e) {
            return reject()
        }
    })
}