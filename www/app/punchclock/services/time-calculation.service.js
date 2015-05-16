(function() {
    'use strict';

    angular.module('app.punchclock')
        .factory('timeCalculationService', timeCalculationServiceFactory);

    timeCalculationServiceFactory.inject = [];
    function timeCalculationServiceFactory() {
        return {
            getTimeString: getTimeString,
            formatNumber: formatNumber,
            formatTotalHours: formatTotalHours,
            getTotalHours: getTotalHours
        };

        function getTimeString(now) {
            var hours, minutes;
            hours = now.getHours();
            minutes = now.getMinutes();
            return formatNumber(hours)+':'+formatNumber(minutes);
        }

        function formatNumber(number) {
            if (number < 10) {
                return "0"+number;
            }
            return number;
        }

        function formatTotalHours(totalTime) {
            var hours = (totalTime - (totalTime%60))/60,
                minutes = totalTime%60;
            return formatNumber(hours)+
                ":"+
                formatNumber(minutes);
        }

        function getTotalHours(arrival, lunchStart, lunchStop, departure) {
            var arrivalTime = getTimeInMinutes(arrival),
                departureTime = getTimeInMinutes(departure),
                totalTime;

            if (lunchStart && lunchStop) {
                arrivalTime  += (getTimeInMinutes(lunchStop) - getTimeInMinutes(lunchStart));
            }

            totalTime = departureTime - arrivalTime;
            return formatTotalHours(totalTime);
        }

        function getTimeInMinutes(time) {
            if (!time) {
                return;
            }
            var parts = time.split(':');
            return parts[0]*60+ parseInt(parts[1], 10);
        }
    }
})();
