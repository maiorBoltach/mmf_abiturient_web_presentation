module.exports = {

    getTime: function (body) {
        const cheerio = require('cheerio');
        $ = cheerio.load(body);
        let time = $('#Abit_K11_lbCurrentDateTime').text();
        let parsedTime = new Date(time.replace(/(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2})/, "$2/$1/$3 $4:$5")).getTime() / 1000;
        return Number(parsedTime);
    },

    getData: function (body, incomeString, type) {
        const cheerio = require('cheerio');
        $ = cheerio.load(body);
        let time = module.exports.getTime(body);
        let currentElement = $('td.vl').filter(function () {
            return $(this).text().trim() === incomeString;
        }).next();
        let arrayRes;
        if(type === "BudgetEnlisment")
            arrayRes = [Number(time)];
        else if(type === "PaidEnlisment")
            arrayRes = [Number(time), 0 ,0];

        let i = 0;
        while (currentElement[0] !== undefined) {
            if(type === "PaidEnlisment" && i === 2)
                arrayRes.push(0);
            arrayRes.push(currentElement.text() !== "" ? Number(currentElement.text()) : 0);
            i++;
            currentElement = currentElement.next();
        }
        return arrayRes;
    },

    parseBudget: function(db) {
        const url1 = 'https://abit.bsu.by/formk1?id=1'; // бюджет
        module.exports.refreshData(db, url1, "BudgetEnlisment");
        const url2 = 'https://abit.bsu.by/formk1?id=7'; // бюджет
        module.exports.refreshData(db, url2, "PaidEnlisment");

    },

    getListOfFields: function() {
        return ["time", "recruitmentBudget", "contract", "recruitmentPaid", "allRecruitments", "target_training", "no_exams", "out_competition", "points400", "points390", "points380", "points370", "points360", "points350", "points340", "points330", "points320", "points310",
            "points300", "points290", "points280", "points270", "points260", "points250", "points240", "points230", "points220", "points210", "points200", "points190", "points180", "points170", "points160",
            "points150", "points140", "points130", "points120", "speciality"];
    },

    getListOfSpec: function(db, type) {
        let add_st = "";
        if(type === "BudgetEnlisment")
        {
            add_st = " where budget_day = 1"
        }
        else if(type === "PaidEnlisment") {
            add_st = " where paid_day = 1"
        }

        let specSql = "select name,speciality_id from Specialities" + add_st;
        let resultArray = [];
        db.all(specSql, function (err, rows) {
            rows.forEach((row) => {
                let row_array = [row.name, row.speciality_id];
                resultArray.push(row_array);
            });
        });
        return resultArray;
    },

    refreshData: function (db, url, type) {
        const request = require('request');
        const specialities = module.exports.getListOfSpec(db, type);
        request({url: url, "rejectUnauthorized": false}, function (err, resp, body) {
            if(body) {
                let time = module.exports.getTime(body);
                console.log(new Date() + " | Refreshing site | " + type + " | " + new Date(time * 1000));
                let timeSql = "SELECT count(*) AS namesCount FROM " + type + " WHERE time = " + time;
                db.all(timeSql, function (err, rows) {
                    let numberOfData = rows[0]['namesCount'];

                    if (numberOfData === 0) {
                        specialities.forEach(function (item, i, arr) {
                            let arrayRes = module.exports.getData(body, item[0], type);
                            arrayRes.push("'" + item[1] + "'");
                            let sql = 'INSERT INTO ' + type + '(' + module.exports.getListOfFields().join() + ') VALUES(' + arrayRes.join() + ')';
                            db.run(sql, function (err) {
                                if (err) {
                                    return console.log(`[Error] ${item[0]} - speciality_id: ${item[1]}: ${err.message}; ${sql}`);
                                }
                                console.log(new Date() + ` | A row has been inserted with rowid ${this.lastID} / ${item[0]} - speciality_id: ${item[1]}`);
                            });
                        });
                    }
                    else console.log(new Date() + " | Already exist");
                });
            }


        });
    }
};
