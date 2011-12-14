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
            var structure = '<table><caption>'+ options.prevButton;
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
            
            structure += options.nextButton + '<select id="' + options.classPrefix + 'month">';

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

            for(i=0; i< 7; i++)
            {
                structure += '<th data-date="' + startDate.getDate() +'" ';
                structure += 'data-day="' + startDate.getDay() +'">';
                structure += options.daysOfTheWeek[startDate.getDay()];
                structure += '<span class="'+ options.classPrefix +'dateHeader">' + startDate.getDate() + '</span></th>';
                startDate.setDate(startDate.getDate() + 1);
            }

            structure += '</tr></thead><tbody>';            
            
            for(i=0; i < (hourNumber*options.hourDivisions); i++)
            {
                structure += '<tr>';

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

                    structure += '<th rowspan="' + options.hourDivisions + '" data-hour="' + hour + '">';
                    structure += hourDisplay + '</th>';
                }

                for(j=0; j < 7; j++)
                {
                    structure += '<td data-selected="false"></td>';
                }

                structure += '</tr>';
            }
            
            structure += '</tbody></table>';

            $(element).html(structure);

            $(element).find('#' + $(options.nextButton).attr('id')).click(function() {
                $(element).trigger('incrementWeek');
            });

            $(element).find('#' + $(options.prevButton).attr('id')).click(function() {
                $(element).trigger('decrementWeek');
            });

            $(element).find('#' + options.classPrefix + "month").change(function() {
                $(element).trigger('changeMonth');
            });

            $(element).find('#' + options.classPrefix + "year").change(function() {
                $(element).trigger('changeYear');
            });
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