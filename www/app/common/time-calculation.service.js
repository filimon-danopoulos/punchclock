(function() {
    'use strict';

    angular.module('app.common')
        .factory('timeCalculationService', timeCalculationServiceFactory);

    timeCalculationServiceFactory.inject = [];
    function timeCalculationServiceFactory() {
        return {
            getTimeString: getTimeString,
            formatNumber: formatNumber,
            formatTotalHours: formatTotalHours,
            getTotalHours: getTotalHours,
            convertToDecimal: convertToDecimal,
            getDepartureTime: getDepartureTime,
            getTimeLeft: getTimeLeft,
            getCurrentKey: getCurrentKey
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

        function convertToDecimal(timeString) {
            var precision = 4,
                timeParts = timeString.split(':'),
                hours = parseInt(timeParts[0], 10),
                minutes = parseInt(timeParts[1], 10);
            minutes = (Math.round((minutes/60)*Math.pow(10, precision))/Math.pow(10, precision));
            return (hours+minutes).toFixed(precision);
        }

        function getTimeLeft(arrival, lunchStart, lunchStop) {
            var now = new Date(),
                departureTime = getDepartureTime(arrival, lunchStart, lunchStop),
                currentTime = getCurrentTime(),
                diff = getTimeInMinutes(departureTime) - getTimeInMinutes(currentTime);
            if (diff < 0) {
                return '-'+formatTotalHours(Math.abs(diff));
            }
            return formatTotalHours(diff);
        }

        function getDepartureTime(arrival, lunchStart, lunchStop) {
            var arrivalTime = getTimeInMinutes(arrival),
                totalTime = arrivalTime + 8*60;

            if (lunchStart && lunchStop) {
                totalTime  += (getTimeInMinutes(lunchStop) - getTimeInMinutes(lunchStart));
            }
            return formatTotalHours(totalTime);
        }

        function getCurrentTime() {
            var now = new Date();
            return now.getHours()+':'+now.getMinutes();
        }


        function getCurrentKey() {
            var date = new Date();
            return date.getFullYear()+
                '-'+
                formatDateNumber(date.getMonth())+
                '-'+
                formatDateNumber(date.getDate());
        }



        function formatDateNumber(number) {
            if (number <= 9) {
                return ['0', number].join('');
            }
            return number;
        }
    }
})();
