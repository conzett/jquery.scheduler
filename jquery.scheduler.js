; (function ($, window, document, undefined) {

    var pluginName = 'scheduler',
        defaults = {
            hourStart: 0,
            hourEnd: 24,
            startDate: new Date(),
            daysOfTheWeek : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            hourDivisions : 2,
            callback : function(){},
            timeConvention : '24Hour',
            classPrefix : '',
            prevButton : '<span id="prev">Previous</span>',
            nextButton : '<span id="next">Next</span>',
            dateMin : undefined, // default value set when plugin initializes
            dateMax : (new Date()).setFullYear((new Date()).getFullYear() + 4)
        };

    function Plugin(element, options) {

        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
                
        this.options.dateMin = this.options.dateMin || this.options.startDate;

        var options = this.options;

        var _generateTable = function(date, element){

            var hourNumber = (options.hourEnd - options.hourStart);
            var structure = '<table role="grid" aria-multiselectable="true"><caption>';
            var startDay = (new Date(options.startDate)).getDay();
            var dateMin = new Date(options.dateMin);
            var dateMax = new Date(options.dateMax);
            var startDate = new Date(date);      

            if(startDate > dateMax){
                startDate = new Date(dateMax);
            }else if(startDate < dateMin){
                startDate = new Date(dateMin);
            }

            if(startDate.getDay() > startDay){
                startDate.setDate((startDate.getDate() - (startDate.getDay() - startDay)));
            }else if(startDate.getDay() < startDay){
                startDate.setDate((startDate.getDate() + (startDay - startDate.getDay())));
            }

            element.currentDate = startDate;

            var endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            
            structure += '<select id="' + options.classPrefix + 'month">';

            for(i=0; i< 12; i++)
            {
                structure += '<option value="' + i;
                
                if(startDate.getMonth() === i){
                    structure += '" selected="selected';
                }

                var tempDate = new Date(startDate);
                tempDate.setMonth(i);

                if((tempDate > dateMax) || (tempDate < dateMin)){
                    structure += '" disabled="disabled';
                }
                
                structure += '">' + options.months[i] + '</option>';
            }

            structure += '</select>';

            structure += startDate.getDate() + ' - ' + endDate.getDate() + ', <select id="' + options.classPrefix + 'year">';

            for(i=dateMin.getFullYear(); i <= dateMax.getFullYear(); i++)
            {
                structure += '<option value="' + i;

                if(startDate.getFullYear() === i){
                    structure += '" selected="selected';
                }
                               
                structure += '">' + i + '</option>';
            }

            structure += '</caption><thead><tr><th></th>';
            
            tempDate = new Date(startDate);            

            for(i=0; i< 7; i++)
            {
                structure += '<th id="'+ options.classPrefix + 'column' + (i+1) + '" scope="column" ';
                structure += 'role="columnheader" data-date="' + tempDate.getDate() +'" ';
                structure += 'data-day="' + tempDate.getDay() +'">';
                structure += options.daysOfTheWeek[tempDate.getDay()];
                structure += '<span class="'+ options.classPrefix +'dateHeader">' + tempDate.getDate() + '</span></th>';
                tempDate.setDate(tempDate.getDate() + 1);
            }

            structure += '</tr></thead><tbody>';       
            
            for(i=0; i < (hourNumber*options.hourDivisions); i++)
            {
                structure += '<tr role="row" id="' + options.classPrefix + 'row' + (i+1) + '">';

                if((i % options.hourDivisions) === 0){

                    var hour = i/options.hourDivisions + options.hourStart;
                    var hourDisplay = '';

                    if(options.timeConvention === '12Hour'){
                        switch(hour){
                            case 0 : hourDisplay = '12:00 AM';
                                break;
                            case 12 : hourDisplay = hour + ':00 PM';
                                break;
                            default :
                                if(hour > 12){
                                    hourDisplay = (hour - 12) + ':00 PM';
                                }else{
                                    hourDisplay = hour + ':00 AM';
                                }
                        }
                    }else{
                        hourDisplay = hour + ':00';
                    }

                    structure += '<th role="rowheader" scope="row" rowspan="' + options.hourDivisions + '" data-hour="' + hour + '">';
                    structure += hourDisplay + '</th>';
                }

                tempDate = new Date(startDate);
                tempDate.setHours(hour);
                tempDate.setMinutes((i % options.hourDivisions)*(60/options.hourDivisions));

                for(j=0; j < 7; j++)
                {
                    structure += '<td role="gridcell" data-column="'+ j +'" aria-selected="false" aria-labelledby="';
                    structure += options.classPrefix + 'column' + (j+1) + ' ';
                    structure += options.classPrefix + 'row' + i + '"';
                    structure += ' data-dateTime="' + tempDate.toString() + '"';

                    if((tempDate < dateMin) || (tempDate > dateMax)){
                        structure += ' aria-disabled="true" class="' + options.classPrefix +'disabled"';
                    }

                    tempDate.setDate(tempDate.getDate() +1);
                    structure += '></td>';
                }

                structure += '</tr>';
            }
            
            structure += '</tbody></table>';
            
            var nextButton = $(options.nextButton);
            var prevButton = $(options.prevButton);

            if(startDate <= dateMin){
                if(prevButton.is(':button')){
                    prevButton.attr('disabled', 'disabled');
                }else{
                    prevButton.attr('aria-disabled', 'true').addClass(options.classPrefix +'disabled');
                }
            }else if(prevButton.not(':button')){
                prevButton.attr('aria-disabled', 'false');
            }

            if(endDate >= dateMax){
                if(nextButton.is(':button')){
                    nextButton.attr('disabled', 'disabled');
                }else{
                    nextButton.attr('aria-disabled', 'true').addClass(options.classPrefix +'disabled');
                }
            }else if(nextButton.not(':button')){
                nextButton.attr('aria-disabled', 'false');
            }

            nextButton.click(function() {
                if($(this).attr("aria-disabled") != "true"){
                    $(element).trigger('incrementWeek');
                }
            });

            prevButton.click(function() {
                if($(this).attr("aria-disabled") != "true"){
                    $(element).trigger('decrementWeek');
                }
            });

            $(element).html(structure);

            $(element).find('#' + options.classPrefix + "month").change(function() {
                $(element).trigger('changeMonth');
            });

            $(element).find('#' + options.classPrefix + "year").change(function() {
                $(element).trigger('changeYear');
            });
            
            $(element).find("caption").prepend(prevButton, nextButton);
            
            $(element).find('[role="gridcell"]').not('[aria-disabled="true"]').mousedown(function() {                
                $(element).trigger('selectStart');
                element.selectedColumn = "";
                element.selecting = true;
                _resetSelection(element);               
                $(this).attr("aria-selected", "true").addClass(options.classPrefix + "selected");
                element.selectedColumn = $(this).attr("data-column");
                element.selected.dateStart = $(this).attr("data-dateTime");
            }).mouseup(function() {
                element.selecting = false;
                element.selected = _getSelectedRange();
                $(element).trigger('selectFinish');
            }).mouseover(function() {
                if(element.selecting === true){
                    var column = $(this).attr("data-column");
                    if(column === element.selectedColumn){
                        var selected = $(this).attr("aria-selected");
                        if(selected === "false"){
                            $(this).attr("aria-selected", "true").addClass(options.classPrefix + "selected");
                            element.selected.dateEnd = $(this).attr("data-dateTime");
                        }else{
                            $(this).attr("aria-selected", "false").removeClass(options.classPrefix + "selected");
                        }
                    }
                }
            });    
        };

        var _resetSelection = function(element){
             $(element).find('[role="gridcell"]').attr("aria-selected", "false").removeClass(options.classPrefix + "selected");
        }

        var _getSelectedRange =  function(){
            var adjustedEndDate = new Date(element.selected.dateEnd);
            adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + (60/options.hourDivisions)); //adjust to be the true "end" time
            return {dateStart: new Date(element.selected.dateStart), dateEnd: adjustedEndDate }
        }

        this.element.currentDate = new Date(this.options.startDate);
        this.element.selecting = false;
        this.element.selected = {dateStart:"", dateEnd:""};
        this.element.selectedColumn;

        this.element.generateTable = function() {
            $(this).trigger('generateTableStart');
            _generateTable(new Date(this.currentDate), this);
            $(this).trigger('generateTableFinish');
        }

        this.element.incrementWeek = function() {
            this.currentDate.setDate(this.currentDate.getDate()+7);
            $(this).trigger('generateTable');
        }

        this.element.decrementWeek = function() {
            this.currentDate.setDate(this.currentDate.getDate()-7);
            $(this).trigger('generateTable');
        }

        this.element.changeMonth = function() {
            this.currentDate.setMonth($('#' + options.classPrefix + "month").val());
            $(this).trigger('generateTable');
        }

        this.element.changeYear = function() {
            this.currentDate.setFullYear($('#' + options.classPrefix + "year").val());
            $(this).trigger('generateTable');
        }

        this.element.selectStart = function() {}

        this.element.selectFinish = function() {}

        this.init();        
    }

    Plugin.prototype.init = function () {
        this.element.generateTable();
        this.options.callback.call();        
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);