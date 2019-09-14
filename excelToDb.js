var db = require("./db.js");
var xlsx = require('node-xlsx');
var fs = require('fs');
var obj = xlsx.parse(__dirname + '/document/battles.csv');

(() => {
    return new Promise(async (resolve, reject) => {
        try {
            let obje = {}
            let dataArr = obj[0].data;
            let dbData = []
            let key = []
            for (let i = 0; i <= dataArr.length; i++) {
                if (dataArr[0][i]) {
                    key.push(dataArr[0][i])
                }
            }
            // console.log("-------------------------key")
            // console.log(key)
            // console.log("-------------------------key")
            for (let j = 1; j <= dataArr.length; j++) {
                if (dataArr[j]) {
                    let data = {}
                    let k = 0
                    key.forEach(element => {
                        data[element] = dataArr[j][k] || null
                        k++
                    });
                    obje[dataArr[j][2]] = data
                    dbData.push(data)
                }
            }
            // console.log("-------------------------obje")
            // console.log(obje)
            // console.log("-------------------------obje")

            // console.log("-------------------------dbData")
            // console.log(dbData)
            // console.log("-------------------------dbData")

            await fs.writeFile(__dirname + '/document/battles.json', JSON.stringify(obje, null, 3), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });

            await db.insertCollection({
                data: dbData,
                collection: "battles"
            })
            return resolve({ status: "success" })
        } catch (e) {
            console.log(e)
            return reject({ status: "error", msg: "caught in createJsonFile fn" })
        }

    })
})().then(data => { console.log(data) }).catch(e => { console.log(e) })


//testing db connection
// (() => {
//     return new Promise(async (resolve, reject) => {
//         try {
//
//             console.log(await db.insertDB({
//                 data: [{
//                     test: "test"
//                 }],
//                 collection:"test"
//             }))
//             return resolve()
//         }
//         catch (e) {
//             console.log(e)
//             return reject()
//         }
//     })
// })()