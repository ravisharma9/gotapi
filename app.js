module.exports = {
    list: list,
    count: count,
    search: search
}
var db = require('./db.js')

function list() {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await db.distinctInCollection({ collection: "battles", key: "location", query: { "location": { $nin: ["", null] } } }))
        } catch (e) {
            return reject()
        }

    })
}

function count() {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await db.distinctInCollection({ collection: "battles", key: "battle_number", query: { "battle_number": { $nin: ["", null] } } }))
        } catch (e) {
            return reject()
        }

    })
}


function search() {
    return new Promise(async (resolve, reject) => {
        try {
            return resolve(await db.distinctInCollection({ collection: "battles", key: "battle_number", query: { "battle_number": { $nin: ["", null] } } }))
        } catch (e) {
            return reject()
        }

    })
}