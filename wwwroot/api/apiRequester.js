document.addEventListener("DOMContentLoaded", function (event) {
    getFacultiesData();
    let studyType = getStudyType();
    firstInit(studyType);
}
);

function firstInit(studyType) {
    let faculty_id = getFacultyId();
    getSpecialitiesData(faculty_id, studyType);
    getBasicData(faculty_id, studyType);
    getAdditionalData("all", faculty_id, studyType);
}

$('#refresh').click(function () {
    let updateValue = $( "#updateOldTime" ).attr( "data-value");
    if( updateValue === "") getAPI();
    else getAPIWithDiff(updateValue);
});

$('#faculties').on("click", "a", function (event) {
    let activeTab = $(this).attr('data-tokens');
    $( "#2018budget" ).attr( "data-value", activeTab );
    $( "#speciality" ).attr( "data-value", 'all' );
    let studyType = getStudyType();
    firstInit(studyType);
});

$('#configuration').on("click", "li", function (event) {
    // let activeTab = $(this).attr('data-tokens');
    // $( "#2018budget" ).attr( "data-value", activeTab );
    $( "#speciality" ).attr( "data-value", 'all' );
    let studyType = $(this).attr('id');
    firstInit(studyType);
});


$('#speciality').on("click", "a", function (event) {
    let faculty_id = getFacultyId();
    let activeTab = $(this).attr('data-tokens');
    let updateValue = $( "#updateOldTime" ).attr( "data-value");
    let studyType = getStudyType();
    if(updateValue === "") {
        getBasicData(faculty_id, studyType);
        getAdditionalData(activeTab, faculty_id, studyType);
    }
    else {
        let time = Math.floor((new Date().getTime() - (Number(updateValue)*60*60*1000)) / 1000);
        console.log(time);
        getBasicDataWithDiff(faculty_id, studyType, time);
        getAdditionalDataWithDiff(activeTab, faculty_id, studyType, time);
        $( "#updateOldTime" ).attr( "data-value", updateValue );
    }
    $( "#speciality" ).attr( "data-value", activeTab );
});

function getAPI() {
    let currentTabId = getSelectedTabId();
    let faculty_id = getFacultyId();
    let studyType = getStudyType();
    getBasicData(faculty_id, studyType);
    getAdditionalData(currentTabId, faculty_id, studyType);
}

function getSpecialitiesData(faculty_id, studyType) {
    let ajaxForm = new ajaxProxy("/api/faculty/" + faculty_id + "/" + studyType + "/list");
    ajaxForm.PopulateTable(printSpecialitiesData, handleError);
}

function getFacultiesData() {
    let ajaxForm = new ajaxProxy("/api/faculty/list");
    ajaxForm.PopulateTable(printFacultyData, handleError);
}


function getAdditionalData(endpoint, faculty_id, studyType) {
    let ajaxForm = new ajaxProxy("/api/faculty/" + faculty_id + "/speciality/" + endpoint + "/" + studyType);
    ajaxForm.PopulateTable(printAdditionalData, handleError);
}

function getBasicData(faculty_id, studyType) {
    let apiCall = new ajaxProxy("/api/faculty/" + faculty_id + "/speciality/all/" + studyType);
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
    let faculty_id = getFacultyId();
    let studyType = getStudyType();
    let time = Math.floor((new Date().getTime() - (Number(hours)*60*60*1000)) / 1000);
    console.log(time);
    let currentTabId = getSelectedTabId();
    getBasicDataWithDiff(faculty_id, studyType, time);
    getAdditionalDataWithDiff(currentTabId, faculty_id, studyType, time);
    $( "#updateOldTime" ).attr( "data-value", hours );
}

function getBasicDataWithDiff(faculty_id, studyType, time) {
    let apiCall = new ajaxProxy("/api/faculty/" + faculty_id + "/speciality/all/" + studyType + "/" + time);
    apiCall.PopulateTable(printBasicDataWithDiff, handleError);
}

function getAdditionalDataWithDiff(endpoint, faculty_id, studyType, time) {
    let apiCall = new ajaxProxy("/api/faculty/" + faculty_id + "/speciality/" + endpoint + "/" + studyType + "/" + time);
    apiCall.PopulateTable(printAdditionalDataWithDiff, handleError);
}

//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
///// Tools

function getFacultyId() {
    return  $( "#2018budget" ).attr( "data-value");
}

function getSelectedTabId(){
        return  $( "#speciality" ).attr( "data-value");
    // return $("div#speciality li.selected a").attr("data-tokens");
}

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
    $('#budgetTable tr').slice(1).remove();
    const tbody = $('#budgetTable').children('tbody');
    const table = tbody.length ? tbody : $('#budgetTable');
    let tableString = "";
    const points = data[0];

    let requirementValue = 0;
    let studyType = getStudyType();
    if(studyType === 'budget')
        requirementValue = points.recruitmentBudget;
    else if(studyType === 'paid')
        requirementValue = points.recruitmentPaid;

    tableString = '<tr><td class="text-center"><strong>' + checkString(requirementValue) + '</strong></td>' +
        '<td class="text-center"><strong>' + checkString(points.allRecruitments) + '</strong></td>' +
        '<td class="text-center"><strong>' + getCurrentPassingScore(points) + '</strong></td></tr>';
    $('#budgetTimeUpdate').html(formatDateTime(points.time));
    table.append(tableString);
}

function printSpecialitiesData(data) {
    var groupFilter = $("#speciality .selectpicker");
    groupFilter.find('option').remove();

    groupFilter.append('<option data-tokens="all" value="all" selected>ВЕСЬ ФАКУЛЬТЕТ</option>');

    $.each(data, function(index, element) {
        groupFilter.append('<option data-tokens="'+element.speciality_id+'" value="'+element.speciality_id+'">'+element.name+'</option>');
    });
    groupFilter.selectpicker("refresh");
}


function printFacultyData(data) {
    let default_faculty = getFacultyId();
    var groupFilter = $("#faculties .selectpicker");
    groupFilter.find('option').remove();

    $.each(data, function(index, element) {
        groupFilter.append('<option data-tokens="'+element.id+'" value="'+element.id+'">'+element.name+'</option>');
    });

    groupFilter.val(default_faculty);
    groupFilter.selectpicker("refresh");

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

    let requirementValue = 0;
    let studyType = getStudyType();
    if(studyType === 'budget')
        requirementValue = newData.recruitmentBudget;
    else if(studyType === 'paid')
        requirementValue = newData.recruitmentPaid;

    tableString = '<tr><td class="text-center"><strong>' + checkString(requirementValue) + '</strong></td>' +
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


    let requirementValue = 0;
    let studyType = getStudyType();
    if(studyType === 'budget')
        requirementValue = newData.recruitmentBudget;
    else if(studyType === 'paid')
        requirementValue = newData.recruitmentPaid;

    tableString1 = '<tr><td class="text-center">' + checkString(requirementValue) + '</td>' +
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

    let requirementValue = 0;
    let studyType = getStudyType();
    if(studyType === 'budget')
        requirementValue = points.recruitmentBudget;
    else if(studyType === 'paid')
        requirementValue = points.recruitmentPaid;

    tableString1 = '<tr><td class="text-center">' + checkString(requirementValue) + '</td>' +
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
    $('#updateOldTime').html("<b>-</b>");

}
