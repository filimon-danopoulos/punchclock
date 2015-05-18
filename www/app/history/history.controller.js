(function() {
    'use strict';

    angular.module('app.history')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = [
        '$scope',
        'persistenceService',
        'dayEntity',
        'timeCalculationService'
    ];
    function HistoryController($scope, persistenceService, dayEntity, time) {
        var vm = this;

        /// Actions
        vm.getDayTotal = getDayTotal;

        /// Events
        $scope.$on('$ionicView.enter', initialize);


        /// Implementaion
        function initialize() {
            vm.days = persistenceService.entity(dayEntity).selectAll();
        }

        function getDayTotal(day) {
            var total = time.getTotalHours(
                day.arrival.value,
                day.lunchStart.value,
                day.lunchStop.value,
                day.departure.value
            );

            if(vm.showTotalsAsDecimals) {
                return time.convertToDecimal(total);
            }

            return total;
        }
    }
})();
