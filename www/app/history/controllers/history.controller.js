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

        /// Events
        $scope.$on('$ionicView.enter', initialize);


        /// Implementaion
        function initialize() {
            vm.days = persistenceService.entity(dayEntity)
                .selectAll()
                .filter(function(x) {
                    return x.arrival.value && x.departure.value;
                });
            showTotalsAsDecimals = settingsService.loadSetting('showHistoryTotalsAsDecimals');
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
    }
})();
