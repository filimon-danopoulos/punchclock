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
        'timeCalculationService'
    ];
    function DetailsController(
            $scope,
            $stateParams,
            persistence,
            dayEntity,
            defaults,
            time) {
        var vm = this;

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
        }

        function getDayTotal() {
            if (!vm.day) {
                return;
            }
            return time.getTotalHours(
                vm.day.arrival.value,
                vm.day.lunchStart.value,
                vm.day.lunchStop.value,
                vm.day.departure.value
            );
        }

        function shouldHideDayPart(dayPart) {
            return (dayPart === 'lunchStart' || dayPart === 'lunchStop') &&
                !vm.day[dayPart].value;
        }
    }
})();
