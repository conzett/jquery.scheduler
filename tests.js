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

    equal($(tbodyHeaders[0]).attr('rowspan'), 2,
                        'Expect the rowspan attribute in the header at position ' + 0 + ' to be 2');

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

    for (i = 13; i < 23; i++) {
        equal($(rowHeaders[i]).html(), i - 12 + ':00 PM',
                        'Expect the day value in the row header at position ' + i + ' to be ' + (i -12) + ':00 PM');
    }

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
    var x = $('#target').scheduler();
    var testIncrementWeek, testDecrementWeek, testGenerateTableStart, testGenerateTableFinish, testGenerateTable;

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

    var table = $('#target');
    var next = table.find("#next");

    $(next).click();

    ok(testIncrementWeek, "incerementWeek raised correctly");
    ok(testGenerateTable, "generateTable raised correctly");
    ok(testGenerateTableStart, "generateTableStart raised correctly");
    ok(testGenerateTableFinish, "generateTableFinish raised correctly");

    table = $('#target');
    var prev = table.find("#prev");

    $(prev).click();

    ok(testDecrementWeek, "decrementWeek raised correctly");
    ok(testGenerateTable, "generateTable raised correctly");
    ok(testGenerateTableStart, "generateTableStart raised correctly");
    ok(testGenerateTableFinish, "generateTableFinish raised correctly");

});

test("Test month and year control generation and function", function () {

    $('#qunit-fixture').append('<div id="target"></div>');
    $('#target').scheduler({
        yearMin: 2008,
        yearMax: 2014,
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