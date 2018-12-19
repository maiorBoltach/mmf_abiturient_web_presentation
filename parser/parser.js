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
            arrayRes = [Number(time), 0 ,0, 0];

        while (currentElement[0] !== undefined) {
            arrayRes.push(currentElement.text() !== "" ? Number(currentElement.text()) : 0);
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

    getListOfSpec: function(type) {
        if(type === "BudgetEnlisment")
        {
            return [['компьютерная математика и системный анализ', 'km'],
                ['математика и информационные технологии (направление - веб-программирование и интернет-технологии)', 'web'],
                ['математика и информационные техно-логии (направление - математическое и программное обеспечение мобильных устройств)', 'mobile'],
                ['математика (направление - научно-конструкторская деятельность)', 'constructor'],
                ['математика (направление - научно-педагогическая деятельность)', 'teacher'],
                ['математика (направление - научно-производственная деятельность)', 'production'],
                ['математика (направление - экономическая деятельность)', 'economist'],
                ['механика и математическое моделирование', 'mechanics']
            ];
        }
        else if(type === "PaidEnlisment") {
            return [['компьютерная математика и системный анализ', 'km'],
                ['математика и информационные технологии (направление - веб-программирование и интернет-технологии)', 'web'],
                ['математика и информационные техно-логии (направление - математическое и программное обеспечение мобильных устройств)', 'mobile']
            ];
        }
    },

    refreshData: function (db, url, type) {
        const request = require('request');
        const specialities = module.exports.getListOfSpec(type);
        request(url, function (err, resp, body) {
            if(body) {
                let time = module.exports.getTime(body);
                console.log(new Date() + " | Refreshing site | " + type + " | " + new Date(time * 1000));
                let timeSql = "SELECT count(*) AS namesCount FROM " + type + " WHERE time = " + time;
                db.all(timeSql, function (err, rows) {
                    let numberOfData = rows[0]['namesCount'];

                    if (numberOfData === 0) {
                        specialities.forEach(function (item, i, arr) {
                            console.log(i + ": " + item[0] + " | " + item[1]);
                            let arrayRes = module.exports.getData(body, item[0], type);
                            arrayRes.push("'" + item[1] + "'");
                            let sql = 'INSERT INTO ' + type + '(' + module.exports.getListOfFields().join() + ') VALUES(' + arrayRes.join() + ')';
                            db.run(sql, function (err) {
                                if (err) {
                                    return console.log(err.message);
                                }
                                console.log(`A row has been inserted with rowid ${this.lastID}`);
                            });

                        });
                    }
                    else console.log("Already exist");
                });
            }


        });
    }
};
