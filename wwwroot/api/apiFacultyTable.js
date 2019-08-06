document.addEventListener("DOMContentLoaded", function (event) {
    let studyType = getStudyType();
    firstInit(studyType);
}
);

function firstInit(studyType) {
    getBasicData(studyType);
}

$('#refresh').click(function () {
    let updateValue = $( "#updateOldTime" ).attr( "data-value");
    if( updateValue === "") getAPI();
    else getAPIWithDiff(updateValue);
});

$('#configuration').on("click", "li", function (event) {
    let studyType = $(this).attr('id');
    firstInit(studyType);
});


function getAPI() {
    let studyType = getStudyType();
    getBasicData(studyType);
}


function getBasicData(studyType) {
    let apiCall = new ajaxProxy("/api/faculty/" + studyType);
    apiCall.PopulateTable(printBasicData, handleError);
}

/////////////////
/////////////////
// Get old data by time

$('#nodiff').click(function () {
    getAPI();
});

$('#diff1hour').click(function () {
    let time = 1;
    getAPIWithDiff(time);
});

$('#diff3hours').click(function () {
    let time = 3;
    getAPIWithDiff(time);
});

$('#diff6hours').click(function () {
    let time = 6;
    getAPIWithDiff(time);
});

$('#diff1day').click(function () {
    let time = 24;
    getAPIWithDiff(time);
});
$('#diff3days').click(function () {
    let time = 3*24;
    getAPIWithDiff(time);
});

function getAPIWithDiff(hours) {
    let studyType = getStudyType();
    let time = Math.floor((new Date().getTime() - (Number(hours)*60*60*1000)) / 1000);
    console.log(time);
    getBasicDataWithDiff(studyType, time);
    $( "#updateOldTime" ).attr( "data-value", hours );
}

function getBasicDataWithDiff(studyType, time) {
    let apiCall = new ajaxProxy("/api/faculty/" + studyType + "/" + time);
    apiCall.PopulateTable(printBasicDataWithDiff, handleError);
}


//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
///// Tools


function getStudyType(){
    return $( "#configuration li.active" ).attr( "id");
}

function handleError(data) {
    console.log(data);
}

function checkString(data) {
    if (data === null) return 0;
    else return data;
}

function formatDateTime(data) {
    const d = new Date(data * 1000);
    return ("00" + d.getDate()).slice(-2) + "/" +
        ("00" + (d.getMonth() + 1)).slice(-2) + "/" +
        d.getFullYear() + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2);
}

function getCurrentPassingScore(data) {
    let stringResult = "";

    let requirementValue = 0;
    let studyType = getStudyType();
    if(studyType === 'budget')
        requirementValue = data.recruitmentBudget;
    else if(studyType === 'paid')
        requirementValue = data.recruitmentPaid;

    let allRecruiments = Number(requirementValue) - Number(data.target_training) - Number(data.no_exams) - Number(data.out_competition);

    top:
        for (let i = 4; i > 0; i--) {

            let minValue = 0;
            let maxValue = 9;
            if (i === 4) maxValue = 0;
            if (i === 1) minValue = 2;
            for (let j = maxValue; j >= minValue; j--) {
                let stringCurrent = 'points' + String(i) + String(j) + String(0);
                let currentValue = Number(data[stringCurrent]);
                if (allRecruiments - currentValue <= 0) {
                    if(stringCurrent === "points120") stringResult = "до 120";
                    else {
                        if(j === 0) stringResult = String(i-1) + String(9) + "0+";
                        else stringResult = String(i) + String(j-1) + "0+";
                    }
                    return stringResult;
                }
                else allRecruiments -= currentValue;
            }
        }
        return "есть места";

}

//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
///// Print data

function printBasicData(data) {
    $('#facultiesInfo tr').slice(1).remove();
    const tbody = $('#facultiesInfo').children('tbody');
    const table = tbody.length ? tbody : $('#facultiesInfo');
    let tableString = "";

    for (var i in data)
    {
        const points = data[i];
        let requirementValue = 0;
        let studyType = getStudyType();
        if(studyType === 'budget')
            requirementValue = points.recruitmentBudget;
        else if(studyType === 'paid')
            requirementValue = points.recruitmentPaid;

        tableString = '<tr><td class="text-center">' + points.name + '</td>' +
            '<td class="text-center"><strong>' + checkString(requirementValue) + '</strong></td>' +
            '<td class="text-center"><strong>' + checkString(points.allRecruitments) + '</strong></td>' +
            '<td class="text-center"><strong>' + getCurrentPassingScore(points) + '</strong></td></tr>';
        table.append(tableString);
        $('#budgetTimeUpdate').html(formatDateTime(points.time));
    }
}

function printDifference(oldData, newData) {
    let result = "";
    if(Number(oldData) > Number(newData)) result = '<strong><small style="color: red"> (↓ ' + (Number(newData)-Number(oldData)) + ')</small></strong>';
    else if(Number(oldData) < Number(newData)) result = '<strong><small style="color: green"> (↑ ' + (Number(newData)-Number(oldData)) + ')</small></strong>';
    else if(Number(oldData) === Number(newData)) result = '<small> (-)</small>';
    return result;
}

function printCurrentPassingScoreDifference(oldData, newData) {
    let result = "";
    let oldDataValue = 0;
    let newDataValue = 0;
    if(oldData !== 'есть места')
        oldDataValue = Number(oldData.slice(0, -1));
    if(newData !== 'есть места')
        newDataValue = Number(newData.slice(0, -1));

    if(Number(newDataValue) > Number(oldDataValue)) result = '<strong><small style="color: red"> (↑ ' + oldData + ')</small></strong>';
    else if(Number(newDataValue) < Number(oldDataValue)) result = '<strong><small style="color: green"> (↓ ' + oldData + ')</small></strong>';
    else if(Number(newDataValue) === Number(oldDataValue)) result = '<small> (-)</small>';
    return result;
}

function printBasicDataWithDiff(data) {
    $('#facultiesInfo tr').slice(1).remove();
    const tbody = $('#facultiesInfo').children('tbody');
    const table = tbody.length ? tbody : $('#facultiesInfo');


    for (var i in data.oldDataValue)
    {
        let tableString = "";
        const oldData = data.oldDataValue[i];
        const newData = data.newDataValue[i];
        let requirementValue = 0;
        let studyType = getStudyType();
        if(studyType === 'budget')
            requirementValue = newData.recruitmentBudget;
        else if(studyType === 'paid')
            requirementValue = newData.recruitmentPaid;

        let currentPassing = getCurrentPassingScore(newData);
        let oldPassing = getCurrentPassingScore(oldData);

        tableString = '<tr><td class="text-center">' + oldData.name + '</td>' +
            '<td class="text-center"><strong>' + checkString(requirementValue) + '</strong></td>' +
            '<td class="text-center"><strong>' + checkString(newData.allRecruitments) + printDifference(oldData.allRecruitments, newData.allRecruitments) + '</strong></td>' +
            '<td class="text-center"><strong>' + currentPassing + printCurrentPassingScoreDifference(oldPassing, currentPassing) + '</strong></td></tr>';
        $('#updateOldTime').html(formatDateTime(oldData.time));
        $('#budgetTimeUpdate').html(formatDateTime(newData.time));
        table.append(tableString);

    }
}