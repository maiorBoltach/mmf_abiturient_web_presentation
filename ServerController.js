module.exports = function(app, db, jsonParser){

    const enlistmentFields = ["time", "speciality", "recruitmentBudget", "recruitmentPaid", "allRecruitments", "points400", "points390", "points380", "points370", "points360", "points350", "points340", "points330", "points320", "points310",
        "points300", "points290", "points280", "points270", "points260", "points250", "points240", "points230", "points220", "points210", "points200", "points190", "points180", "points170", "points160",
        "points150", "points140", "points130", "points120", "target_training", "no_exams", "out_competition", "contract"];

    const enlistmentSumFields = ["time", "sum(recruitmentBudget) as recruitmentBudget", "sum(recruitmentPaid) as recruitmentPaid", "sum(allRecruitments) as allRecruitments", "sum(points400) as points400",
        "sum(points390) as points390", "sum(points380) as points380", "sum(points370) as points370", "sum(points360) as points360", "sum(points350) as points350", "sum(points340) as points340",
        "sum(points330) as points330", "sum(points320) as points320", "sum(points310) as points310", "sum(points300) as points300", "sum(points290) as points290", "sum(points280) as points280",
        "sum(points270) as points270", "sum(points260) as points260", "sum(points250) as points250", "sum(points240) as points240", "sum(points230) as points230", "sum(points220) as points220",
        "sum(points210) as points210", "sum(points200) as points200", "sum(points190) as points190", "sum(points180) as points180", "sum(points170) as points170", "sum(points160) as points160",
        "sum(points150) as points150", "sum(points140) as points140", "sum(points130) as points130", "sum(points120) as points120",
        "sum(target_training) as target_training", "sum(no_exams) as no_exams", "sum(out_competition) as out_competition", "sum(contract) as contract"];

    console.log("Registering endpoint: /");
    console.log("Registering endpoint: /api/budget");
    console.log("Registering endpoint: /api/paid");

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/wwwroot/index.html');
    });

    app.get('/api/budget/:speciality', function(req, res){
        let speciality = req.params.speciality;
        let sql = "";
        if(speciality==='all') sql = "SELECT " + enlistmentSumFields.join(", ") + " FROM BudgetEnlisment WHERE time = (SELECT MAX(time) FROM BudgetEnlisment)";
        else sql = "SELECT " + enlistmentFields.join(", ") + " FROM BudgetEnlisment WHERE time = (SELECT MAX(time) FROM BudgetEnlisment)  AND speciality = '" + speciality + "'";
        console.log(sql);
        db.all(sql, function(err, rows) {
            res.json(rows);
        });
    });

    app.get('/api/budget/:speciality/:time', function(req, res){
        let speciality = req.params.speciality;
        let time = req.params.time;
        let sql = "";
        if(speciality==='all') sql = "SELECT " + enlistmentSumFields.join(", ") + " FROM BudgetEnlisment WHERE time = (SELECT time FROM BudgetEnlisment ORDER BY abs(time - '" + time + "') LIMIT 1) ";
        else sql = "SELECT " + enlistmentFields.join(", ") + " FROM BudgetEnlisment WHERE time = (SELECT time FROM BudgetEnlisment ORDER BY abs(time - '" + time + "') LIMIT 1)  AND speciality = '" + speciality + "'";
        console.log(sql);
        db.all(sql, function(err, oldData) {
            let oldDataValue = oldData[0];
            let sqlNew = "";
            if(speciality==='all') sqlNew = "SELECT " + enlistmentSumFields.join(", ") + " FROM BudgetEnlisment WHERE time = (SELECT MAX(time) FROM BudgetEnlisment)";
            else sqlNew = "SELECT " + enlistmentFields.join(", ") + " FROM BudgetEnlisment WHERE time = (SELECT MAX(time) FROM BudgetEnlisment)  AND speciality = '" + speciality + "'";
            console.log(sqlNew);
            db.all(sqlNew, function(err, newData) {
                let newDataValue = newData[0];
                res.send({oldDataValue, newDataValue});
            });

        });
    });

    app.get('/api/paid/:speciality', function(req, res){
        let queryBy = req.params.speciality;
        let sql = "";
        if(queryBy==='all') sql = "SELECT " + enlistmentSumFields.join(", ") + " FROM PaidEnlisment WHERE time = (SELECT MAX(time) FROM PaidEnlisment)";
        else sql = "SELECT " + enlistmentFields.join(", ") + " FROM PaidEnlisment WHERE time = (SELECT MAX(time) FROM PaidEnlisment)  AND speciality = '" + queryBy + "'";
        console.log(sql);
        db.all(sql, function(err, rows) {
                res.json(rows);
        });
    });
};