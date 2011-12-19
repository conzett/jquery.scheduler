var prevButton = '<span id="prev">Previous</span>';
var nextButton = '<span id="next">Next</span>';
var daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

test("Table markup generation with deafult options", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    $('#target').scheduler();

    var table = $('#target table');
    var caption = table.find("caption");
    var thead = table.find("thead tr th");
    var tbody = table.find("tbody tr");
    var tbodyHeaders = table.find("tbody tr th");    
    var i;

    equal(thead.length, 8, "Expect the number of column headers to be 7 + 1 empty");

    date = new Date();

    //equal(table.attr("data-start-date"), date.toDateString(), "Expect the table data-start-date attribute to equal todays date");

    for (i = 1; i < thead.size(); i++) {
        equal($(thead[i]).attr('data-date'), date.getDate(),
                    'Expect the date value in the header at position ' + i + ' to be ' + date.getDate());
        date.setDate(date.getDate() + 1);
    }

    date = new Date();

    for (i = 1; i < thead.size(); i++) {
        equal($(thead[i]).attr('data-day'), date.getDay(),
                        'Expect the day value in the header at position ' + i + ' to be ' + date.getDay());
        date.setDate(date.getDate() + 1);
    }

    date = new Date();

    for (i = 1; i < thead.size(); i++) {
        var expected = daysOfTheWeek[date.getDay()] + '<span class="dateHeader">' + date.getDate() + '</span>';
        equal($(thead[i]).html(), expected,
                        'Expect the day value in the header at position ' + i + ' to be ' + expected);
        date.setDate(date.getDate() + 1);
    }

    equal(tbody.length, 48, "Expect the number of row headers to be 48: 24 hours * 2 default increments");

    equal($(tbodyHeaders[0]).attr('data-hour'), 0,
                        'Expect the hour data value in the header at position ' + 0 + ' to be ' + 0);


    equal($(tbodyHeaders[12]).attr('data-hour'), 12,
                        'Expect the hour data value in the header at position ' + 12 + ' to be ' + 12);

    equal($(tbodyHeaders[23]).attr('data-hour'), 23,
                        'Expect the hour data value in the header at position ' + 23 + ' to be ' + 23);

    var cells = $(tbody[12]).find('td');

    equal(cells.length, 7, 'Expect the default 7 cells in this row');

    date = new Date();
    var dateString = months[date.getMonth()] + ' ' + date.getDate() + ' - ' + (date.getDate() + 6) + ', ' + date.getFullYear();

    //equal($(caption).html(), prevButton + nextButton + dateString, "Expect the caption date to be " + prevButton + nextButton + dateString);

});

test("Table markup generation with non-deafult options", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    $('#target').scheduler({
        startDate: "Jul 09, 2010",
        hourDivisions: 4,
        hourStart: 9,
        hourEnd: 17,
        classPrefix : 'test_'
    });

    var table = $('#target table');
    var thead = table.find("thead tr th");
    var dateHeaders = thead.find('span');
    var caption = table.find("caption");
    var rows = table.find("tbody tr");
    var rowHeaders = table.find("tbody tr th");

    equal(rows.length, 32, "Expect the number of rows to be 32: 8 hours * 4 specified increments");

    //equal(table.attr("data-start-date"), "Fri Jul 09 2010", "Expect the table data-start-date attribute to equal the provided date");

    equal($(thead[1]).attr('data-day'), 5, "Expect the first day in the calendar to be 5 or friday as it was on the provided date");

    equal($(thead[1]).attr('data-date'), 9, "Expect the first date in the calendar to be 9 as that was the provided date");

    equal($(thead[7]).attr('data-date'), 15, "Expect the last date in the calendar to be 15 as that is 7 days after the provided date");

    equal($(rowHeaders[0]).attr('data-hour'), 9, "Expect the first hour in the calendar to be 9");

    equal($(rowHeaders[7]).attr('data-hour'), 16, "Expect the first hour in the calendar to be 16");

    //equal($(caption).html(), prevButton + nextButton + "July 9 - 15, 2010", "Expect the caption date to be " + prevButton + nextButton +" July 9 - 15, 2010");

    equal($(dateHeaders[1]).attr('class'), "test_dateHeader", "Expect the class of the date header to be test_hourHeader, test_ being the supplie class prefix");

});

test("Table markup generation with 12 hour a day formatting", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    $('#target').scheduler({ timeConvention : '12Hour' });

    var table = $('#target');
    var thead = table.find("thead tr th");
    var rows = table.find("tbody tr");
    var rowHeaders = table.find("tbody tr th");

    equal($(rowHeaders[0]).html(), '12:00 AM',
                        'Expect the day value in the row header at position 0 to be 12:00 AM');

    equal($(rowHeaders[12]).html(), '12:00 PM',
                        'Expect the day value in the row header at position 12 to be 12:00 PM');

});

test("Incrementing and decrementing the week", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    $('#target').scheduler({
        startDate: "Jul 9, 2010"
    });

    var table = $('#target');    
    var next = table.find("#next");

    $(next).click();

    table = $('#target');
    var thead = table.find("thead th");

    equal($(thead[1]).attr('data-date'), 16,
        'After we click the next button again we expect the date value in the table header at position 1 to be a week later than the provided date argument');

    table = $('#target');
    var prev = table.find("#prev");

    $(prev).click();

    table = $('#target');
    thead = table.find("thead th");

    equal($(thead[1]).attr('data-date'), 9,
        'After we click the next button we expect the date value in the table header at position 1 to be back to the provided date argument');

});

test("Test binding to custom events", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    var x = $('#target').scheduler({ startDate: "Jul 9, 2011" });
    var testIncrementWeek, testDecrementWeek, testGenerateTableStart, testGenerateTableFinish,
        testChangeMonth, testChangeYear, testGenerateTable;

    x.bind("incrementWeek", function (event) {
        testIncrementWeek = true;
    });

    x.bind("generateTableStart", function (event) {
        testGenerateTableStart = true;
    });

    x.bind("generateTableFinish", function (event) {
        testGenerateTableFinish = true;
    });

    x.bind("generateTable", function (event) {
        testGenerateTable = true;
    });

    x.bind("decrementWeek", function (event) {
        testDecrementWeek = true;
    });

    x.bind("changeMonth", function (event) {
        testChangeMonth = true;
    });

    x.bind("changeYear", function (event) {
        testChangeYear = true;
    });

    var date = new Date();

    var table = $('#target');
    var next = table.find("#next");

    $(next).click();

    ok(testIncrementWeek, "Expect true: incerementWeek raised correctly");
    ok(testGenerateTable, "Expect true: generateTable raised correctly");
    ok(testGenerateTableStart, "Expect true: generateTableStart raised correctly");
    ok(testGenerateTableFinish, "Expect true: generateTableFinish raised correctly");

    table = $('#target');
    var prev = table.find("#prev");

    $(prev).click();

    ok(testDecrementWeek, "Expect true: decrementWeek raised correctly");
    ok(testGenerateTable, "Expect true: generateTable raised correctly");
    ok(testGenerateTableStart, "Expect true: generateTableStart raised correctly");
    ok(testGenerateTableFinish, "Expect true: generateTableFinish raised correctly");

    $("#year").val('2012').change();
    ok(testChangeYear, "Expect true: changeYear raised correctly");

    $("#month").val('5').change();
    ok(testChangeMonth, "Expect true: changeMonth raised correctly");

});

test("Test month and year control generation", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    $('#target').scheduler({
        dateMin: "Jan 1, 2008",
        dateMax: "Dec 31, 2014",
        classPrefix: 'something_'
    });

    var table = $('#target table');
    var thead = table.find("thead tr th");
    var caption = table.find("caption");
    var i;

    var date = new Date();

    var monthList = caption.find("#something_month");
    var monthOption = monthList.find("option");
    var yearList = caption.find("#something_year");
    var yearOption = yearList.find("option");

    for (i = 0; i < 11; i++) {
        equal($(monthOption[i]).html(), months[i], 'Expect the html in the option at position ' + i + ' to be ' + months[i]);
    }

    for (i = 0; i < 11; i++) {
        equal($(monthOption[i]).attr('value'), i,
                        'Expect the value in the option at position ' + i + ' to be ' + i);
    }

    var selectedAttrVal = $(monthList).find('option[value="' + date.getMonth() + '"]').attr('selected');
    equal(selectedAttrVal, "selected", 'Expect the correct current month to be selected');

    date.setFullYear(2008);

    for (i = 0; i < 7; i++) {
        equal($(yearOption[i]).attr('value'), date.getFullYear(),
                        'Expect the value in the option at position ' + i + ' to be ' + date.getFullYear());
        date.setFullYear(date.getFullYear() + 1);
    }

    date = new Date();
    selectedAttrVal = $(yearList).find('option[value="' + date.getFullYear() + '"]').attr('selected');
    equal(selectedAttrVal, "selected", 'Expect the correct current year to be selected');

});

test("Test month and year control useage", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    var x = $('#target').scheduler({ startDate: "Jun 9, 2010", classPrefix: "test_" });

    var table = $('#target table');
    var thead = table.find("thead tr th");
    var caption = table.find("caption");

    var monthList = caption.find("#test_month");
    var yearList = caption.find("#test_year");

    var i;
    var selectedAttrVal;


    $(monthList).val('8').change();
    selectedAttrVal = $('#test_month').find('option[value="8"]').attr('selected');
    equal(selectedAttrVal, "selected", 'Expect the correct changed month to be selected');

    selectedAttrVal = undefined;

    $("#test_year").val('2012');

    selectedAttrVal = $('#test_year').find('option[value="2012"]').attr('selected');
    equal(selectedAttrVal, "selected", 'Expect the correct changed year to be selected');

});

test("Test disabled month and year controls with the min and max date parameters", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 15, 2011",
        dateMin: "Oct 1, 2010",
        dateMax: "Nov 30, 2011"
    });

    var monthOptions = $('#month option');

    equal($(monthOptions[11]).attr('disabled'), "disabled",
        'Expect the month of December to be disabled since it falls outside the dateMax range');

    $('#year').val('2010').change();

    monthOptions = $('#month option');

    equal($(monthOptions[11]).attr('disabled'), undefined,
        'After decrementing the year expect the month of December to NOT be disabled since it falls inside the dateMax range');

    equal($(monthOptions[8]).attr('disabled'), "disabled",
        'After decrementing the year expect the month of September to be disabled since it falls outside the dateMin range');

    $('#month').val('11').change();
    $('#year').val('2011').change();

    monthOptions = $('#month option');

    equal($(monthOptions).filter(":selected").val(), "10",
        'After changing the month past the max year month, then changing the year selected month should be that of the max month');

    $('#month').val('5').change();
    $('#year').val('2010').change();

    monthOptions = $('#month option');

    equal($(monthOptions).filter(":selected").val(), 8,
        'After changing the month before the min year month, then changing the year selected month should be that of September the previous month since the min months starts in the middle of the week for these test dates');

    equal($(monthOptions).filter(":selected").attr("disabled"), "disabled",
        'It should be disabled even though it is selected because it is a partial week');

});

test("Test changing months and years always results in first day of week being the same", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 13, 2011"
    });

    $('#month').val('9').change();

    var thead = x.find("thead tr th");

    equal($(thead[1]).attr('data-day'), 0,
        'Expect the day of October to be Sunday, same as the day we switched from');

});

test("Test to see that the table cells that are outsdie the date range are successfully disabled", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 15, 2011",
        dateMin: "Oct 1, 2010",
        dateMax: "Nov 30, 2011"
    });

    $('#month').val('8').change();
    $('#year').val('2010').change();

    var cells = x.find("tbody tr td").slice(0, 2);
    var correctlyDisabled = true;

    for (i = 0; i < cells.length; i++) {
        if ($(cells[i]).attr("aria-disabled") !== "true") {
            correctlyDisabled = false;
        }
    }

    ok(correctlyDisabled,
        'Expect this to be true since all of the tested tables should be aria-disabled');

});

test("Test for the presence of correct aria rolls", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 15, 2011",
        dateMin: "Oct 1, 2010",
        dateMax: "Nov 30, 2011",
        classPrefix: 'test_'
    });

    var bodyRows = x.find("tbody tr");
    var bodyCells = x.find("tbody td");
    var headCells = x.find("thead th");
    var bodyHeaders = x.find("tbody th");
    var table = x.find("table");
    var haveCorectRowID = true;
    var haveCorectHeadID = true;
    var haveRoleRow = true;
    var haveRoleGridCell = true;
    var haveCorrectScopeRow = true;
    var haveCorrectScopeColumn = true;
    var haveCorrectRoleRowHeader = true;
    var haveCorrectRoleColumnHeader = true;
    var haveCorrectRowHeader = true;
    var haveCorrectLabelledBy = true;

    for (i = 0; i < bodyRows.length; i++) {
        if ($(bodyRows[i]).attr("id") != ("test_row" + (i+1))) {
            haveCorectRowID = false;
        }
        if ($(bodyRows[i]).attr("role") != "row") {
            haveRoleRow = false;
        }

        var temp = $(bodyRows[i]).find("td");
        var j;

        for (j = 0; j < 7; j++) {
            if ($(temp[j]).attr("aria-labelledby") != ("test_column" + (j+1) + " test_row" + i)) {
                haveCorrectLabelledBy = false;
            }
            if ($(temp[j]).attr("role") != "gridcell") {
                haveRoleGridCell = false;
            }
        }
    }

    for (i = 1; i < headCells.length; i++) {
        if ($(headCells[i]).attr("id") != ("test_column" + i)) {
            haveCorectHeadID = false;
        }
        if ($(headCells[i]).attr("role") != "columnheader") {
            haveCorrectRoleColumnHeader = false;
        }
        if ($(headCells[i]).attr("scope") != "column") {
            haveCorrectScopeColumn = false;
        }
    }

    for (i = 0; i < bodyHeaders.length; i++) {
        if ($(bodyHeaders[i]).attr("scope") != "row") {
            haveCorrectScopeRow = false;
        }
        if ($(bodyHeaders[i]).attr("role") != "rowheader") {
            haveCorrectRoleRowHeader = false;
        }
    }

    ok(haveCorectRowID,
        'Expect this to be true since all of the rows in the table body should have their correct IDs based on index');

    ok(haveRoleRow,
        'Expect this to be true since all of the rows in the table body should have the role "row"');

    ok(haveRoleGridCell,
        'Expect this to be true since all of the table cells in the table body should have the role "gridcell"');

    ok(haveCorectHeadID,
        'Expect this to be true since all of the header elements should have their correct IDs based on index');

    equal($(table).attr('role'), 'grid',
        'Expect the table to have a role of "grid"');

    equal($(table).attr('aria-multiselectable'), 'true',
        'Expect the table to have aria-multiselectable set to "true"');

    ok(haveCorrectRoleColumnHeader,
        'Expect this to be true since all of the column header elements should have the role "columnheader"');

    ok(haveCorrectScopeColumn,
        'Expect this to be true since all of the column header elements should have the scope "column"');

    ok(haveCorrectRoleRowHeader,
        'Expect this to be true since all of the row header elements should have the aria role "rowheader"');

    ok(haveCorrectScopeRow,
        'Expect this to be true since all of the row header elements should have the scope "row"');

    ok(haveCorrectLabelledBy,
        'Expect this to be true since all of the rows should have a labelledby attribute that is correct');

});

test("Test passing in custom buttons for previous and next", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 13, 2011",
        prevButton: "<button>Previous</button>",
        nextButton: "<button>Next</button>"
    });

    var buttons = $('caption').find("button");
    var headers = $("thead th");

    equal(buttons.length, 2,
        'Expect two buttons inserted into the caption element');

    var firstDate = $(headers[1]).attr("data-date");

    $(buttons[1]).click();

    headers = $("thead th");

    var secondDate = $(headers[1]).attr("data-date");

    equal((secondDate - firstDate), 7,
        'Expect the date to be the next weeks date after the next button is clicked');

    buttons = $('caption').find("button");
    $(buttons[0]).click();

    var newDate = $($("thead th")[1]).attr("data-date");

    equal(newDate, firstDate,
        'Expect the date to be back to the current date after the previous button is clicked');

});

test("Test disabling previous and next buttons when they are non-button elements", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 13, 2011",
        prevButton: '<span id="prev">Prev</span>',
        nextButton: '<span id="next">Next</span>'
    });

    var disabled = $("#prev").attr("aria-disabled");

    equals(disabled, "true",
        'Expect the default state of the previous button to be disabled if we do not specify a mindate since that will equal the start day');

});

test("Test disabling previous and next buttons when they are button elements", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 13, 2011",
        prevButton: '<button id="prev">Prev</button>',
        nextButton: '<button id="next">Next</button>'
    });

    var disabled = $("#prev").attr("disabled");

    equals(disabled, "disabled", 
        'Expect the default state of the previous button to be disabled if we do not specify a mindate since that will equal the start day');

});

test("Test disabling previous and next buttons when they are non-button elements and the start date is greater than the dateMin", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 13, 2011",
        dateMin: "Nov 7, 2011",
        dateMax: "Nov 19, 2011",
        prevButton: '<span id="prev">Prev</span>',
        nextButton: '<span id="next">Next</span>'
    });

    var disabled = $("#prev").attr("aria-disabled");

    equals(disabled, "false",
        'Expect the default state of the previous button to not be disabled since the dateMin is lower than the start date');

    $("#prev").click();

    disabled = $("#prev").attr("aria-disabled");

    ok(disabled,
        'After clicking, Expect the state of the previous button to be disabled since we have reached the end of the calendar');

    $("#next").click();

    disabled = $("#prev").attr("aria-disabled");

    equals(disabled, "false",
        'After clicking next, Expect the state of the previous button to not be disabled since we have gone forward again');

    $("#next").click();

    disabled = $("#next").attr("aria-disabled");

    ok(disabled,
        'After clicking next again, Expect the state of the next button to be disabled since we have gone to the dateMax');
});

test("Test disabling previous and next buttons when they are button elements and the start date is greater than the dateMin", function () {

    $('#qunit-fixture').append('<div id="target"></div>');

    var x = $('#target').scheduler({
        startDate: "Nov 13, 2011",
        dateMin: "Nov 7, 2011",
        dateMax: "Nov 19, 2011",
        prevButton: '<button id="prev">Prev</button>',
        nextButton: '<button id="next">Next</button>'
    });

    var disabled = $("#prev").attr("disabled");

    equals(disabled, undefined,
        'Expect the default state of the previous button to be undefined since the dateMin is lower than the start date');

    $("#prev").click();

    disabled = $("#prev").attr("disabled");

    equals(disabled, "disabled",
        'After clicking, Expect the state of the previous button to be disabled since we have reached the end of the calendar');

    $("#next").click();

    disabled = $("#prev").attr("disabled");

    equals(disabled, undefined,
        'After clicking next, Expect the state of the previous button to be undefined since we have gone forward again');

    $("#next").click();

    disabled = $("#next").attr("disabled");

    equals(disabled, "disabled",
        'After clicking next again, Expect the state of the next button to be disabled since we have gone to the dateMax');
});