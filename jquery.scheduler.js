; (function ($, window, document, undefined) {

    var pluginName = 'scheduler',
        defaults = {
            hourStart: 0,
            hourEnd: 24,
            startDate: (new Date()).toDateString(),
            daysOfTheWeek : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            hourDivisions : 2,
            callback : function(){},
            timeConvention : '24Hour',
            classPrefix : '',
            prevButton : '<span id="prev">Previous</span>',
            nextButton : '<span id="next">Next</span>'
        };

    function Plugin(element, options) {

        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        var currentCalendarDate = new Date(this.options.startDate);
        var options = this.options;

        this.element.generateTable = function(startDate){
            var hourNumber = (options.hourEnd - options.hourStart);
            var structure = '<table><caption>'+ options.prevButton;
            var date = new Date(startDate);
            var endDate = new Date(startDate);

            endDate.setDate(endDate.getDate() + 6);
            
            structure += options.nextButton + options.months[date.getMonth()] + ' ';
            structure += date.getDate() + ' - ' + endDate.getDate() + ', ';
            structure += date.getFullYear() + '</caption><thead><tr><th></th>';            

            for(i=0; i< 7; i++)
            {
                structure += '<th data-date="' + date.getDate() +'" ';
                structure += 'data-day="' + date.getDay() +'">';
                structure += options.daysOfTheWeek[date.getDay()];
                structure += '<span class="'+ options.classPrefix +'dateHeader">' + date.getDate() + '</span></th>';
                date.setDate(date.getDate() + 1);
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

            var element = $(this).html(structure);

            $(element).find('#' + $(options.nextButton).attr('id')).click(function() {
                $(element).trigger('incrementWeek');
            });

            $(element).find('#' + $(options.prevButton).attr('id')).click(function() {
                $(element).trigger('decrementWeek');
            });
        };

        this.element.incrementWeek = function() {
            currentCalendarDate.setDate(currentCalendarDate.getDate()+7);
            this.generateTable(new Date(currentCalendarDate));
        }

        this.element.decrementWeek = function() {
            currentCalendarDate.setDate(currentCalendarDate.getDate()-7);
            this.generateTable(new Date(currentCalendarDate));
        }

        this.init();        
    }

    Plugin.prototype.init = function () {
        this.element.generateTable(this.options.startDate);
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