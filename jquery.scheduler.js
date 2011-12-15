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

                for(j=0; j < 7; j++)
                {
                    structure += '<td role="gridcell" aria-selected="false" aria-labelledby="';
                    structure += options.classPrefix + 'column' + (j+1) + ' ';
                    structure += options.classPrefix + 'row' + i + '"';

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

            nextButton.click(function() {
                $(element).trigger('incrementWeek');
            });

            prevButton.click(function() {
                $(element).trigger('decrementWeek');
            });

            $(element).html(structure);

            $(element).find('#' + options.classPrefix + "month").change(function() {
                $(element).trigger('changeMonth');
            });

            $(element).find('#' + options.classPrefix + "year").change(function() {
                $(element).trigger('changeYear');
            });
            
            $(element).find("caption").prepend(prevButton, nextButton);         
        };

        this.element.currentDate = new Date(this.options.startDate);

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