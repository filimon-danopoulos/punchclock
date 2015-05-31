(function() {
    'use strict';

    angular.module('app.history')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = [
        '$scope',
        'persistenceService',
        'dayEntity',
        'timeCalculationService',
        'settingsService'
    ];
    function HistoryController($scope, persistenceService, dayEntity, time, settingsService) {
        var vm = this,
            showTotalsAsDecimals;

        /// Actions
        vm.getDayTotal = getDayTotal;
        vm.isFirstDayInWeek = isFirstDayInWeek;

        /// Events
        $scope.$on('$ionicView.enter', initialize);


        /// Implementaion
        function initialize() {
            vm.days = persistenceService.entity(dayEntity)
                .selectAll()
                .filter(function(x) {
                    return x.arrival.value && x.departure.value;
                })
                .map(function(x) {
                    x.week = getWeekNumber(x.date);
                    return x;
                });
            showTotalsAsDecimals = settingsService.loadSetting('showHistoryTotalsAsDecimals');
        }

        function getWeekNumber(date) {
            var d = new Date(date);
            d.setHours(0,0,0);
            d.setDate(d.getDate()+4-(d.getDay()||7));
            return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        }

        function getDayTotal(day) {
            var total = time.getTotalHours(
                day.arrival.value,
                day.lunchStart.value,
                day.lunchStop.value,
                day.departure.value
            );

            if(showTotalsAsDecimals) {
                return time.convertToDecimal(total);
            }

            return total;
        }

        function isFirstDayInWeek(date, $index) {
            return vm.days.map(function(x) {return x.date;}).indexOf(date) === $index;
        }
    }
})();
