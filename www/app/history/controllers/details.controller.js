(function() {
    'use strict';

    angular.module('app.history')
        .controller('DetailsController', DetailsController);

    DetailsController.$inject = [
        '$scope',
        '$stateParams',
        'persistenceService',
        'dayEntity',
        'punchclockDefaults',
        'timeCalculationService',
        'settingsService'
    ];
    function DetailsController(
            $scope,
            $stateParams,
            persistence,
            dayEntity,
            defaults,
            time,
            settingsService) {
        var vm = this,
            showTotalsAsDecimals,
            showIncompleEnties;

        /// Data
        vm.daysParts = [
            'arrival',
            'lunchStart',
            'lunchStop',
            'departure'
        ];

        /// Actions
        vm.getDayTotal = getDayTotal;
        vm.shouldHideDayPart = shouldHideDayPart;

        /// Events
        $scope.$on('$ionicView.enter', initialize);

        /// Implementation

        function initialize() {
            vm.day = persistence.entity(dayEntity)
                .select($stateParams.date);

            vm.descriptions = {
                arrival: defaults.arrival.description,
                lunchStart: defaults.lunchStart.description,
                lunchStop: defaults.lunchStop.description,
                departure: defaults.departure.description
            };

            showTotalsAsDecimals = settingsService.loadSetting('showHistoryTotalsAsDecimals');
            showIncompleEnties = settingsService.loadSetting('showIncompleEntiesInHistory');
        }

        function getDayTotal() {
            if (!vm.day || (showIncompleEnties && (!vm.day.arrival.value || !vm.day.departure.value))) {
                return;
            }
            var total = time.getTotalHours(
                vm.day.arrival.value,
                vm.day.lunchStart.value,
                vm.day.lunchStop.value,
                vm.day.departure.value
            );

            if (showTotalsAsDecimals) {
                return time.convertToDecimal(total);
            }

            return total;
        }

        function shouldHideDayPart(dayPart) {
            if (!vm.day) {
                return;
            }
            return (dayPart === 'lunchStart' || dayPart === 'lunchStop') &&
                !vm.day[dayPart].value;
        }
    }
})();
