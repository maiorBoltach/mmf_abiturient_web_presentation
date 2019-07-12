module.exports = function(app, db, jsonParser){

    const enlistmentFields = ["time", "speciality", "name", "recruitmentBudget", "recruitmentPaid", "allRecruitments", "points400", "points390", "points380", "points370", "points360", "points350", "points340", "points330", "points320", "points310",
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
    console.log("Registering endpoint: /api/faculty");

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/wwwroot/index.html');
    });

    app.get('/api/faculty/list', function(req, res){
        let sql = "select id, name from Faculties";
        db.all(sql, function(err, rows) {
            res.json(rows);
        });
    });

    app.get('/api/faculty/:facultyId/list', function(req, res){
        let facultyId = req.params.facultyId;
        let sql = "select speciality_id, name from Specialities where faculty_id = " + facultyId;
        db.all(sql, function(err, rows) {
            res.json(rows);
        });
    });

    app.get('/api/faculty/:facultyId/:studyType/list', function(req, res){
        let facultyId = req.params.facultyId;
        let studyType = req.params.studyType;

        let where_conf = '';
        if(studyType==='budget')
            where_conf = ' and budget_day = 1';
        else if(studyType==='paid')
            where_conf = ' and paid_day = 1';

        let sql = "select speciality_id, name from Specialities where faculty_id = " + facultyId + where_conf;
        db.all(sql, function(err, rows) {
            res.json(rows);
        });
    });


    app.get('/api/faculty/:facultyId/speciality/:specialityId/:studyType', function(req, res){
        let facultyId = req.params.facultyId;
        let specialityId = req.params.specialityId;
        let studyType = req.params.studyType;

        console.log(new Date() + " | BASE_API: " + facultyId + " | " + specialityId + " | " + studyType);

        let table = '';
        if(studyType==='budget')
            table = 'BudgetEnlisment';
        else if(studyType==='paid')
            table = 'PaidEnlisment';

        let sql = "";
        if(specialityId==='all') sql = "SELECT " + enlistmentSumFields.join(", ") + " FROM " + table + " LEFT JOIN Specialities ON " + table + ".speciality = Specialities.speciality_id WHERE time = (SELECT MAX(time) FROM " + table + ") AND Specialities.faculty_id = " + facultyId;
        else sql = "SELECT " + enlistmentFields.join(", ") + " FROM " + table + " LEFT JOIN Specialities ON " + table + ".speciality = Specialities.speciality_id WHERE time = (SELECT MAX(time) FROM " + table + ") AND speciality = " + specialityId;
        db.all(sql, function(err, rows) {
            res.json(rows);
        });
    });


    app.get('/api/faculty/:facultyId/speciality/:specialityId/:studyType/:time', function(req, res){
        let facultyId = req.params.facultyId;
        let specialityId = req.params.specialityId;
        let studyType = req.params.studyType;
        let time = req.params.time;

        console.log(new Date() + " | REFRESH_API: " + facultyId + " | " + specialityId + " | " + studyType + " | " + time);

        let table = '';
        if(studyType==='budget')
            table = 'BudgetEnlisment';
        else if(studyType==='paid')
            table = 'PaidEnlisment';

        let sql = "";
        if(specialityId==='all') sql = "SELECT " + enlistmentSumFields.join(", ") + " FROM " + table + " LEFT JOIN Specialities ON " + table + ".speciality = Specialities.speciality_id WHERE time = (SELECT time FROM " + table + " ORDER BY abs(time - '" + time + "') LIMIT 1) AND Specialities.faculty_id = " + facultyId;
        else sql = "SELECT " + enlistmentFields.join(", ") + " FROM " + table + " LEFT JOIN Specialities ON " + table + ".speciality = Specialities.speciality_id WHERE time = (SELECT time FROM " + table + " ORDER BY abs(time - '" + time + "') LIMIT 1) AND speciality = " + specialityId;
        db.all(sql, function(err, oldData) {
            let oldDataValue = oldData[0];
            let sqlNew = "";
            if(specialityId==='all') sqlNew = "SELECT " + enlistmentSumFields.join(", ") + " FROM " + table + " LEFT JOIN Specialities ON " + table + ".speciality = Specialities.speciality_id WHERE time = (SELECT MAX(time) FROM " + table + ") AND Specialities.faculty_id = " + facultyId;
            else sqlNew = "SELECT " + enlistmentFields.join(", ") + " FROM " + table + " LEFT JOIN Specialities ON " + table + ".speciality = Specialities.speciality_id WHERE time = (SELECT MAX(time) FROM " + table + ") AND speciality = " + specialityId;
            db.all(sqlNew, function(err, newData) {
                let newDataValue = newData[0];
                res.send({oldDataValue, newDataValue});
            });
        });
    });
};