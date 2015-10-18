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
            showTotalsAsDecimals,
            showIncompleEnties,
            days;

        /// Data
        vm.weekFilter = "";

        /// Actions
        vm.getDayTotal = getDayTotal;
        vm.isFirstDayInWeek = isFirstDayInWeek;

        /// Events
        $scope.$on('$ionicView.enter', initialize);
        $scope.$watch(function() {
            return vm.weekFilter;
        }, function(newValue, oldValue) {
            var num = parseInt(newValue, 10),
                pattern;
            if (isNaN(num) || !num) {
                vm.days = days;
                return;
            }
            pattern = new RegExp('^'+num);
            vm.days = days.filter(function(x) {
                return pattern.test(x.week);
            });
        });


        /// Implementaion
        function initialize() {
            loadData();
            showTotalsAsDecimals = settingsService.loadSetting('showHistoryTotalsAsDecimals');
            showIncompleEnties = settingsService.loadSetting('showIncompleEntiesInHistory');
        }

        function loadData() {
            days = persistenceService.entity(dayEntity)
                .selectAll()
                .filter(function(x) {
                    return showIncompleEnties || x.arrival.value && x.departure.value;
                })
                .map(function(x) {
                    x.week = getWeekNumber(x.date);
                    return x;
                });

            days = days.sort(function(a, b) {
                var aDay = getDay(a.date),
                    aWeek = getWeekNumber(a.date);
            });


            vm.days = days;
        }

        function getDay(date) {
            var day = date.getDay();
            if (day === 0) {
                return 7;
            }
            return day;
        }

        function getWeekNumber(date) {
            var d = new Date(date);
            d.setHours(0,0,0);
            d.setDate(d.getDate()+4-(d.getDay()||7));
            return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        }

        function getDayTotal(day) {
            if(showIncompleEnties && (!day.arrival.value || !day.departure.value)) {
                return;
            }

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

        function isFirstDayInWeek(week, $index) {
            return vm.days.map(function(x) {
                    return x.week;
                }).indexOf(week) === $index;
        }
    }
})();
