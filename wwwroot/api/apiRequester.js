document.addEventListener("DOMContentLoaded", function (event) {
    getBasicData();
    getAdditionalData("all");
    }
);

$('#refresh').click(function () {
    let updateValue = $( "#updateOldTime" ).attr( "data-value");
    if( updateValue === "") getAPI();
    else getAPIWithDiff(updateValue);
});


$('#speciality').on("click", "li", function (event) {
    let activeTab = $(this).attr('id');
    let updateValue = $( "#updateOldTime" ).attr( "data-value");
    if(updateValue === "") {
        getBasicData();
        getAdditionalData(activeTab);
    }
    else {
        let time = Math.floor((new Date().getTime() - (Number(updateValue)*60*60*1000)) / 1000);
        console.log(time);
        getBasicDataWithDiff(time);
        getAdditionalDataWithDiff(activeTab, time);
        $( "#updateOldTime" ).attr( "data-value", hours );
    }

    
});

function getAPI() {
    let currentTabId = getSelectedTabId();
    getBasicData();
    getAdditionalData(currentTabId);
}

function getAdditionalData(endpoint) {
    let ajaxForm = new ajaxProxy("/api/budget/" + endpoint);
    ajaxForm.PopulateTable(printAdditionalData, handleError);
}

function getBasicData() {
    let apiCall = new ajaxProxy("/api/budget/all");
    apiCall.PopulateTable(printBasicData, handleError);
}

/////////////////
/////////////////
// Get old data by time

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
    let time = Math.floor((new Date().getTime() - (Number(hours)*60*60*1000)) / 1000);
    console.log(time);
    let currentTabId = getSelectedTabId();
    getBasicDataWithDiff(time);
    getAdditionalDataWithDiff(currentTabId, time);
    $( "#updateOldTime" ).attr( "data-value", hours );
}

function getBasicDataWithDiff(time) {
    let apiCall = new ajaxProxy("/api/budget/all/" + time);
    apiCall.PopulateTable(printBasicDataWithDiff, handleError);
}

function getAdditionalDataWithDiff(endpoint, time) {
    let ajaxForm = new ajaxProxy("/api/budget/" + endpoint + "/" + time);
    ajaxForm.PopulateTable(printAdditionalDataWithDiff, handleError);
}

//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
///// Tools

function getSelectedTabId(){
    return $("ul#speciality li.active").attr("id");
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
    let allRecruiments = Number(data.recruitmentBudget) - Number(data.target_training) - Number(data.no_exams) - Number(data.out_competition);
    top:
        for (let i = 4; i > 0; i--) {

            let minValue = 0;
            let maxValue = 9;
            if (i === 4) maxValue = 0;
            if (i === 1) minValue = 2;
            for (let j = maxValue; j >= minValue; j--) {
                let stringCurrent = 'points' + String(i) + String(j) + String(0);
                let currentValue = Number(data[stringCurrent]);
                console.log(stringCurrent + " | " + allRecruiments + " - " + currentValue);
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
    $('#budgetTable tr').slice(1).remove();
    const tbody = $('#budgetTable').children('tbody');
    const table = tbody.length ? tbody : $('#budgetTable');
    let tableString = "";
    const points = data[0];
    tableString = '<tr><td class="text-center"><strong>' + checkString(points.recruitmentBudget) + '</strong></td>' +
        '<td class="text-center"><strong>' + checkString(points.allRecruitments) + '</strong></td>' +
        '<td class="text-center"><strong>' + getCurrentPassingScore(points) + '</strong></td></tr>';
    $('#budgetTimeUpdate').html(formatDateTime(points.time));
    table.append(tableString);


}

function printDifference(oldData, newData) {
    let result = "";
    if(Number(oldData) > Number(newData)) result = '<strong><small style="color: red"> (↓ ' + (Number(newData)-Number(oldData)) + ')</small></strong>';
    else if(Number(oldData) < Number(newData)) result = '<strong><small style="color: green"> (↑ ' + (Number(newData)-Number(oldData)) + ')</small></strong>';
    else if(Number(oldData) === Number(newData)) result = '<small> (-)</small>';
    return result;
}

function printBasicDataWithDiff(data) {
    $('#budgetTable tr').slice(1).remove();
    const tbody = $('#budgetTable').children('tbody');
    const table = tbody.length ? tbody : $('#budgetTable');
    let tableString = "";
    const oldData = data.oldDataValue;
    const newData = data.newDataValue;
    tableString = '<tr><td class="text-center"><strong>' + checkString(newData.recruitmentBudget) + '</strong></td>' +
        '<td class="text-center"><strong>' + checkString(newData.allRecruitments) + printDifference(oldData.allRecruitments, newData.allRecruitments) + '</strong></td>' +
        '<td class="text-center"><strong>' + getCurrentPassingScore(newData) + '</strong></td></tr>';
    $('#updateOldTime').html(formatDateTime(oldData.time));
    $('#budgetTimeUpdate').html(formatDateTime(newData.time));
    table.append(tableString);


}

function printAdditionalDataWithDiff(data) {
    $('#budgetTable1 tr').slice(2).remove();
    $('#budgetTable2 tr').slice(2).remove();
    $('#budgetTable3 tr').slice(1).remove();

    //if no tbody just select your table
    const tbody1 = $('#budgetTable1').children('tbody');
    const tbody2 = $('#budgetTable2').children('tbody');
    const tbody3 = $('#budgetTable3').children('tbody');
    const table1 = tbody1.length ? tbody1 : $('#budgetTable1');
    const table2 = tbody2.length ? tbody2 : $('#budgetTable2');
    const table3 = tbody3.length ? tbody3 : $('#budgetTable3');

    let tableString1 = "";
    let tableString2 = "";
    let tableString3 = "";

    const oldData = data.oldDataValue;
    const newData = data.newDataValue;

    tableString1 = '<tr><td class="text-center">' + checkString(newData.recruitmentBudget) + '</td>' +
        '<td class="text-center">' + checkString(newData.allRecruitments) + printDifference(oldData.allRecruitments, newData.allRecruitments) + '</td>' +
        '<td class="text-center"></td>' +
        '<td class="text-center">' + checkString(newData.target_training) + printDifference(oldData.target_training, newData.target_training) + '</td>' +
        '<td class="text-center">' + checkString(newData.no_exams) + printDifference(oldData.no_exams, newData.no_exams) + '</td>' +
        '<td class="text-center">' + checkString(newData.out_competition) + printDifference(oldData.out_competition, newData.out_competition) + '</td></tr>';

    tableString2 = '<tr><td class="text-center">' + checkString(newData.points400) + printDifference(oldData.points400, newData.points400) + '</td>' +
        '<td class="text-center">' + checkString(newData.points390) + printDifference(oldData.points390, newData.points390) + '</td>' +
        '<td class="text-center">' + checkString(newData.points380) + printDifference(oldData.points380, newData.points380) + '</td>' +
        '<td class="text-center">' + checkString(newData.points370) + printDifference(oldData.points370, newData.points370) + '</td>' +
        '<td class="text-center">' + checkString(newData.points360) + printDifference(oldData.points360, newData.points360) + '</td>' +
        '<td class="text-center">' + checkString(newData.points350) + printDifference(oldData.points350, newData.points350) + '</td>' +
        '<td class="text-center">' + checkString(newData.points340) + printDifference(oldData.points340, newData.points340) + '</td>' +
        '<td class="text-center">' + checkString(newData.points330) + printDifference(oldData.points330, newData.points330) + '</td>' +
        '<td class="text-center">' + checkString(newData.points320) + printDifference(oldData.points320, newData.points320) + '</td>' +
        '<td class="text-center">' + checkString(newData.points310) + printDifference(oldData.points310, newData.points310) + '</td>' +
        '<td class="text-center">' + checkString(newData.points300) + printDifference(oldData.points300, newData.points300) + '</td>' +
        '<td class="text-center">' + checkString(newData.points290) + printDifference(oldData.points290, newData.points290) + '</td>' +
        '<td class="text-center">' + checkString(newData.points280) + printDifference(oldData.points280, newData.points280) + '</td>' +
        '<td class="text-center">' + checkString(newData.points270) + printDifference(oldData.points270, newData.points270) + '</td></tr>';

    tableString3 = '<tr><td class="text-center">' + checkString(newData.points260) + printDifference(oldData.points260, newData.points260) + '</td>' +
        '<td class="text-center">' + checkString(newData.points250) + printDifference(oldData.points250, newData.points250) + '</td>' +
        '<td class="text-center">' + checkString(newData.points240) + printDifference(oldData.points240, newData.points240) + '</td>' +
        '<td class="text-center">' + checkString(newData.points230) + printDifference(oldData.points230, newData.points230) + '</td>' +
        '<td class="text-center">' + checkString(newData.points220) + printDifference(oldData.points220, newData.points220) + '</td>' +
        '<td class="text-center">' + checkString(newData.points210) + printDifference(oldData.points210, newData.points210) + '</td>' +
        '<td class="text-center">' + checkString(newData.points200) + printDifference(oldData.points200, newData.points200) + '</td>' +
        '<td class="text-center">' + checkString(newData.points190) + printDifference(oldData.points190, newData.points190) + '</td>' +
        '<td class="text-center">' + checkString(newData.points180) + printDifference(oldData.points180, newData.points180) + '</td>' +
        '<td class="text-center">' + checkString(newData.points170) + printDifference(oldData.points170, newData.points170) + '</td>' +
        '<td class="text-center">' + checkString(newData.points160) + printDifference(oldData.points160, newData.points160) + '</td>' +
        '<td class="text-center">' + checkString(newData.points150) + printDifference(oldData.points150, newData.points150) + '</td>' +
        '<td class="text-center">' + checkString(newData.points140) + printDifference(oldData.points140, newData.points140) + '</td>' +
        '<td class="text-center">' + checkString(newData.points130) + printDifference(oldData.points130, newData.points130) + '</td>' +
        '<td class="text-center">' + checkString(newData.points120) + printDifference(oldData.points120, newData.points120) + '</td></tr>';

    table1.append(tableString1);
    table2.append(tableString2);
    table3.append(tableString3);
    $('#updateOldTime').html(formatDateTime(oldData.time));
    $('#budgetTimeUpdate').html(formatDateTime(newData.time));
}

function printAdditionalData(data) {
    $('#budgetTable1 tr').slice(2).remove();
    $('#budgetTable2 tr').slice(2).remove();
    $('#budgetTable3 tr').slice(1).remove();

    //if no tbody just select your table
    const tbody1 = $('#budgetTable1').children('tbody');
    const tbody2 = $('#budgetTable2').children('tbody');
    const tbody3 = $('#budgetTable3').children('tbody');
    const table1 = tbody1.length ? tbody1 : $('#budgetTable1');
    const table2 = tbody2.length ? tbody2 : $('#budgetTable2');
    const table3 = tbody3.length ? tbody3 : $('#budgetTable3');

    let tableString1 = "";
    let tableString2 = "";
    let tableString3 = "";

    const points = data[0];

    tableString1 = '<tr><td class="text-center">' + checkString(points.recruitmentBudget) + '</td>' +
        '<td class="text-center">' + checkString(points.allRecruitments) + '</td>' +
        '<td class="text-center"></td>' +
        '<td class="text-center">' + checkString(points.target_training) + '</td>' +
        '<td class="text-center">' + checkString(points.no_exams) + '</td>' +
        '<td class="text-center">' + checkString(points.out_competition) + '</td></tr>';

    tableString2 = '<tr><td class="text-center">' + checkString(points.points400) + '</td>' +
        '<td class="text-center">' + checkString(points.points390) + '</td>' +
        '<td class="text-center">' + checkString(points.points380) + '</td>' +
        '<td class="text-center">' + checkString(points.points370) + '</td>' +
        '<td class="text-center">' + checkString(points.points360) + '</td>' +
        '<td class="text-center">' + checkString(points.points350) + '</td>' +
        '<td class="text-center">' + checkString(points.points340) + '</td>' +
        '<td class="text-center">' + checkString(points.points330) + '</td>' +
        '<td class="text-center">' + checkString(points.points320) + '</td>' +
        '<td class="text-center">' + checkString(points.points310) + '</td>' +
        '<td class="text-center">' + checkString(points.points300) + '</td>' +
        '<td class="text-center">' + checkString(points.points290) + '</td>' +
        '<td class="text-center">' + checkString(points.points280) + '</td>' +
        '<td class="text-center">' + checkString(points.points270) + '</td></tr>';

    tableString3 = '<tr><td class="text-center">' + checkString(points.points260) + '</td>' +
        '<td class="text-center">' + checkString(points.points250) + '</td>' +
        '<td class="text-center">' + checkString(points.points240) + '</td>' +
        '<td class="text-center">' + checkString(points.points230) + '</td>' +
        '<td class="text-center">' + checkString(points.points220) + '</td>' +
        '<td class="text-center">' + checkString(points.points210) + '</td>' +
        '<td class="text-center">' + checkString(points.points200) + '</td>' +
        '<td class="text-center">' + checkString(points.points190) + '</td>' +
        '<td class="text-center">' + checkString(points.points180) + '</td>' +
        '<td class="text-center">' + checkString(points.points170) + '</td>' +
        '<td class="text-center">' + checkString(points.points160) + '</td>' +
        '<td class="text-center">' + checkString(points.points150) + '</td>' +
        '<td class="text-center">' + checkString(points.points140) + '</td>' +
        '<td class="text-center">' + checkString(points.points130) + '</td>' +
        '<td class="text-center">' + checkString(points.points120) + '</td></tr>';

    table1.append(tableString1);
    table2.append(tableString2);
    table3.append(tableString3);
}
